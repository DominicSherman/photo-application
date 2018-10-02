import {Platform} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from 'firebase';
import 'firebase/database';
import 'firebase/storage';
import RNHeicConverter from 'react-native-heic-converter';

import {config, ENV} from '../../config';
import {clean} from '../constants/helper-functions';

let Blob, fs;

Blob = RNFetchBlob.polyfill.Blob;
fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export const initializeFirebase = () => firebase.initializeApp(config);

const getPayload = (image, user, downloadUrl) => {
    let isVideo = false;
    const {email, name} = user;
    const height = 4;
    const width = (image.width / image.height) * height;
    const last3 = image.filename.substr(-3).toLowerCase();
    if (last3 === 'mov' || last3 === 'mp4') {
        isVideo = true;
    }

    return {
        fileName: image.filename,
        url: downloadUrl,
        height,
        width,
        isVideo,
        email,
        name
    }
};

const insertDatabaseRef = (downloadUrl, sessionId, image, actions, user) => {
    return firebase.database().ref(`${ENV}/media`).child(sessionId).child(`${Date.now()}`).set(
        getPayload(image, user, downloadUrl),
        (error) => {
        if (error) {
            console.log('ERROR', error);
        } else {
            actions.incrementFinished();
        }
    });
};

const handleSuccess = async (uploadTask, sessionId, image, actions, user) => {
    uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => insertDatabaseRef(downloadUrl, sessionId, image, actions, user));
};


const handleStateChange = (snapshot, index, actions) => {
    if (typeof snapshot.bytesTransferred === 'number') {
        actions.setProgress(index, snapshot.bytesTransferred);
    }
};

const handleError = (error) => {
    console.log('ERROR', error);
};

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

export const uploadImage = async (actions, image, index, sessionId, user) => {
    const mime = 'application/octet-stream';
    const imageRef = firebase.storage().ref(`${ENV}/${sessionId}`).child(`${image.filename}`);

    const uploadUri = await getUploadUri(image);
    const blob = await fs.readFile(uploadUri, 'base64').then((data) => {
        return Blob.build(data, {type: `${mime};BASE64`});
    });
    let uploadTask = imageRef.put(blob, {contentType: mime});
    actions.setTotal(index, uploadTask.snapshot.totalBytes);
    uploadTask.on('state_changed',
        (snapshot) => handleStateChange(snapshot, index, actions),
        handleError,
        () => handleSuccess(uploadTask, sessionId, image, actions, user));
};

export const getUsers = () => firebase.database().ref(`${ENV}/users`);

export const addUser = (email, isAdmin) =>
    firebase.database().ref(`${ENV}/users`).child(`${clean(email)}`).set({
        email,
        isAdmin
    }, (error) => {
        if (error) {
            console.log('ERROR', error);
        } else {
            console.log('Database insert complete');
        }
    });