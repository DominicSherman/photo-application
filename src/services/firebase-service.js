import {Platform} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from 'firebase';
import 'firebase/database';
import 'firebase/storage';
import RNHeicConverter from 'react-native-heic-converter';

import {config} from '../config';
import {clean} from '../constants/service';

let isInitialized = false;
const getPayload = (image, user, downloadUrl) => {
    let isVideo = false;
    const {email, name} = user;
    const height = 4;
    const width = image.width / image.height * height;
    const last3 = image.filename.substr(-3).toLowerCase();

    if (last3 === 'mov' || last3 === 'mp4') {
        isVideo = true;
    }

    return {
        email,
        fileName: image.filename,
        height,
        isVideo,
        name,
        url: downloadUrl,
        width
    };
};

const insertDatabaseRef = ({downloadUrl, env, sessionId, image, actions, user}) =>
    firebase.database()
        .ref(`${env}/media`)
        .child(sessionId)
        .child(`${Date.now()}`)
        .set(getPayload(image, user, downloadUrl),
            (error) => {
                if (!error) {
                    actions.incrementFinished();
                }
            });

const handleSuccess = ({uploadTask, env, sessionId, image, actions, user}) =>
    uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) =>
        insertDatabaseRef({
            actions,
            downloadUrl,
            env,
            image,
            sessionId,
            user
        })
    );

const handleStateChange = (snapshot, index, actions) => {
    if (typeof snapshot.bytesTransferred === 'number') {
        actions.setProgress(index, snapshot.bytesTransferred);
    }
};

const getUploadUri = (image) => {
    const path = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;

    if (image.filename.substr(-4) === 'HEIC') {
        return RNHeicConverter
            .convert({
                path
            })
            .then((result) => result.path);
    }

    return path;
};

export const uploadImage = async ({actions, env, image, index, sessionId, user}) => {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;

    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const mime = 'application/octet-stream';
    const imageRef = firebase.storage().ref(`${env}/${sessionId}`).child(`${image.filename}`);

    const uploadUri = await getUploadUri(image);
    const blob = await fs.readFile(uploadUri, 'base64').then((data) => Blob.build(data, {type: `${mime};BASE64`}));
    const uploadTask = imageRef.put(blob, {contentType: mime});

    actions.setTotal(index, uploadTask.snapshot.totalBytes);
    uploadTask.on('state_changed',
        (snapshot) => handleStateChange(snapshot, index, actions),
        null,
        () => handleSuccess({
            actions,
            env,
            image,
            sessionId,
            uploadTask,
            user
        })
    );
};

export const getUsers = (env) => firebase.database().ref(`${env}/users`);

export const addUser = (email, isAdmin, env) =>
    firebase.database().ref(`${env}/users`).child(`${clean(email)}`).set({
        email,
        isAdmin
    });

export const getMedia = (env) => firebase.database().ref(`${env}/media`);

export const initializeFirebase = () => {
    if (!isInitialized) {
        firebase.initializeApp(config);
        isInitialized = true;
    }
};
