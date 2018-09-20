import {Platform} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import * as firebase from 'firebase';
import {config} from '../../config';

let Blob, fs;

export const initializeFirebase = () => {
    Blob = RNFetchBlob.polyfill.Blob;
    fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    firebase.initializeApp(config);
};

const handleStateChange = (snapshot, index, setProgress) => {
    if (typeof snapshot.bytesTransferred === 'number') {
        setProgress(index, snapshot.bytesTransferred);
    }
};

const handleError = (error) => {
    console.log('ERROR', error);
};

const handleSuccess = async (uploadTask, sessionId, image, index, blob, incrementFinished) => {
    blob.close();
    incrementFinished();

    uploadTask.snapshot.ref.getDownloadURL().then(async (downloadUrl) =>
        await firebase.database().ref(`${sessionId}/`).child(index).set({
            fileName: image.filename.replace(/[^a-zA-Z0-9]/g, ''),
            url: downloadUrl
        }, (error) => {
            if (error) {
                console.log('ERROR', error);
            } else {
                console.log('Database insert complete');
            }
        })
    );
};

export const uploadImage = async (image, index, sessionId, incrementFinished, setProgress, setTotal) => {
    const mime = 'application/octet-stream';
    const uploadUri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;
    const imageRef = firebase.storage().ref(`${sessionId}`).child(`${image.filename}`);
    const blob = await fs.readFile(uploadUri, 'base64').then((data) => {
        return Blob.build(data, {type: `${mime};BASE64`});
    });

    let uploadTask = imageRef.put(blob, {contentType: mime});
    setTotal(index, uploadTask.snapshot.totalBytes);
    uploadTask.on('state_changed',
        (snapshot) => handleStateChange(snapshot, index, setProgress),
        handleError,
        () => handleSuccess(uploadTask, sessionId, image, index, blob, incrementFinished));
};