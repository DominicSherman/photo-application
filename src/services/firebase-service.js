import {Platform} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from 'firebase';
import 'firebase/database';
import 'firebase/storage';
import RNHeicConverter from 'react-native-heic-converter';
import uuid from 'uuid';

import {config} from '../config';
import {clean} from '../constants/service';

let isInitialized = false;

export const initializeFirebase = () => {
    if (!isInitialized) {
        firebase.initializeApp(config);
        isInitialized = true;
    }
};

const getIsVideo = (filename) => {
    const last3 = filename ? filename.substr(-3).toLowerCase() : null;

    return last3 === 'mov' || last3 === 'mp4';
};

const getPayload = (image, user, downloadUrl) => {
    const {email, name} = user;
    const height = 4;
    const width = image.width / image.height * height;
    const isVideo = getIsVideo(image.filename);

    return {
        email,
        fileName: image.filename ? image.filename : null,
        height,
        isVideo,
        name,
        url: downloadUrl,
        width
    };
};

const insertDatabaseRef = ({eventId, downloadUrl, env, sessionId, image, actions, user}) =>
    firebase.database()
        .ref(`${env}/media/${eventId}`)
        .child(sessionId)
        .child(`${Date.now()}`)
        .set(getPayload(image, user, downloadUrl),
            (error) => {
                if (!error) {
                    actions.incrementFinished();
                }
            });

const handleSuccess = ({eventId, uploadTask, env, sessionId, image, actions, user}) =>
    uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) =>
        insertDatabaseRef({
            actions,
            downloadUrl,
            env,
            eventId,
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

    if (image.filename && image.filename.substr(-4) === 'HEIC') {
        return RNHeicConverter
            .convert({
                path
            })
            .then((result) => result.path);
    }

    return path;
};

export const uploadImage = async ({eventId, eventName, actions, env, image, index, sessionId, user}) => {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;

    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const mime = 'application/octet-stream';
    const imageRef = firebase.storage().ref(`${env}/${eventName}`).child(`${image.uri}-${sessionId}`);

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
            eventId,
            image,
            sessionId,
            uploadTask,
            user
        })
    );
};

export const getUsers = (env, eventId) => firebase.database().ref(`${env}/users/${eventId}`);

export const addUser = (eventId, email, isAdmin, env) =>
    firebase.database().ref(`${env}/users/${eventId}/${clean(email)}`).set({
        email,
        isAdmin
    });

export const getMedia = (env, eventId) => firebase.database().ref(`${env}/media/${eventId}`);

export const createEvent = (env, eventName, primaryAdmin) => {
    const eventId = uuid.v4();

    firebase.database().ref(`${env}/events/${eventId}`).set({
        eventId,
        eventName,
        primaryAdmin
    });

    addUser(eventId, primaryAdmin, true, env);
};

export const getEvents = (env) => firebase.database().ref(`${env}/events`);
