import {Platform} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from 'firebase';
import 'firebase/database';
import 'firebase/storage';
import RNHeicConverter from 'react-native-heic-converter';

import {config, ENV} from '../../config';

let Blob, fs;

Blob = RNFetchBlob.polyfill.Blob;
fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export const initializeFirebase = () => firebase.initializeApp(config);

const getUploadUri = async (image) => {
    let path = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;

    if (image.filename.substr(-4) === 'HEIC') {
        return RNHeicConverter
            .convert({
                path
            })
            .then((result) => {
                return result.path;
            });
    } else {
        return path;
    }
};

const insertDatabaseRef = (downloadUrl, sessionId, image) => {
    const height = 4;
    const width = (image.width/image.height)*height;
    return firebase.database().ref(`${ENV}/images`).child(sessionId).child(`${Date.now()}`).set({
        fileName: image.filename.replace(/[^a-zA-Z0-9]/g, ''),
        url: downloadUrl,
        height,
        width
    }, (error) => {
        if (error) {
            console.log('ERROR', error);
        } else {
            console.log('Database insert complete');
        }
    });
};

const handleSuccess = async (uploadTask, sessionId, image, actions) => {
    actions.incrementFinished();

    uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => insertDatabaseRef(downloadUrl, sessionId, image));
};


const handleStateChange = (snapshot, index, actions) => {
    if (typeof snapshot.bytesTransferred === 'number') {
        actions.setProgress(index, snapshot.bytesTransferred);
    }
};

const handleError = (error) => {
    console.log('ERROR', error);
};

export const uploadImage = async (actions, image, index, sessionId) => {
    const mime = 'application/octet-stream';
    const imageRef = firebase.storage().ref(`${ENV}/images/${sessionId}`).child(`${image.filename}`);

    const uploadUri = await getUploadUri(image);
    const blob = await fs.readFile(uploadUri, 'base64').then((data) => {
        return Blob.build(data, {type: `${mime};BASE64`});
    });
    let uploadTask = imageRef.put(blob, {contentType: mime});
    actions.setTotal(index, uploadTask.snapshot.totalBytes);
    uploadTask.on('state_changed',
        (snapshot) => handleStateChange(snapshot, index, actions),
        handleError,
        () => handleSuccess(uploadTask, sessionId, image, actions));
};