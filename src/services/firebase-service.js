import {Platform} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import * as firebase from 'firebase';

let Blob, fs;

export const initializeFirebase = () => {
    Blob = RNFetchBlob.polyfill.Blob;
    fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const config = {
        apiKey: "AIzaSyBV-TeuzUPQtLqA8VEz1CcXaMNSd_SaDVY",
        authDomain: "wedding-photo-application.firebaseapp.com",
        databaseURL: "https://wedding-photo-application.firebaseio.com",
        projectId: "wedding-photo-application",
        storageBucket: "wedding-photo-application.appspot.com",
        messagingSenderId: "717477731043"
    };
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
        await firebase.database().ref(`${sessionId}/${index}`).set({
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
    const uploadUri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;
    const storageRef = firebase.storage().ref(`${sessionId}`);
    const imageRef = storageRef.child(`${image.filename}`);
    const blob = await fs.readFile(uploadUri, 'base64').then((data) => {
        return Blob.build(data, {contentType: 'image/jpeg',type: 'BASE64'});
    });

    let uploadTask = imageRef.put(blob, {contentType: 'BASE64'});
    setTotal(index, uploadTask.snapshot.totalBytes);
    uploadTask.on('state_changed',
        (snapshot) => handleStateChange(snapshot, index, setProgress),
        handleError,
        () => handleSuccess(uploadTask, sessionId, image, index, blob, incrementFinished));
};