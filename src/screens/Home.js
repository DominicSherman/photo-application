import React from 'react';
import {CameraRoll, Platform, View} from 'react-native';
import {withRedux} from '../redux-factory';
import {numPictures} from '../constants/variables';
import SelectedPreview from '../components/SelectedPreview';
import PlusButton from '../components/PlusButton';
import UploadButton from '../components/UploadButton';
import ImageSelectModal from './ImageSelectModal';
import RNFetchBlob from 'react-native-fetch-blob';
import * as firebase from 'firebase';
import {getCurrentTime, getCameraRollRows} from '../constants/helper-functions';

let Blob, fs;

export class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            cameraRollRows: []
        };

        this.currSelected = {};
    }

    componentWillMount() {
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
    }

    componentDidMount() {
        CameraRoll.getPhotos({
            first: numPictures,
            assetType: 'All',
        }).then((r) => this.setState({cameraRollRows: getCameraRollRows(r)}));
    }

    onStateChange = (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
        }
    };

    handleError = (error) => {
        console.log('ERROR', error);
    };

    handleSuccess = (uploadTask, blob) => {
        blob.close();
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('', );
            console.log('File available at', downloadURL);
        });
    };

    uploadImage = async (image, index, sessionId) => {
        const uploadUri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;
        const imageRef = firebase.storage().ref(`${sessionId}`).child(`${index} - ${image.filename}`);
        const blob = await fs.readFile(uploadUri, 'base64').then((data) => {
            return Blob.build(data, {type: 'BASE64'});
        });

        let uploadTask = imageRef.put(blob, {contentType: 'BASE64'});
        uploadTask.on('state_changed', this.onStateChange, this.handleError, () => this.handleSuccess(uploadTask, blob));
    };

    uploadImages = async (selectedImages) => {
        await Object.keys(selectedImages).forEach(async (key, index) => {
            const {image} = selectedImages[key];

            await this.uploadImage(image, index, getCurrentTime());
        });
    };

    setCurrSelected = (newCurrSelected) => {
        this.currSelected = newCurrSelected;
        this.forceUpdate();
    };

    setSelected = (item, isSelected) => {
        const {image: {filename}} = item;

        if (isSelected) {
            this.currSelected = {
                ...this.currSelected,
                [`${filename}`]: item
            };
        } else {
            this.currSelected = {
                ...this.currSelected,
                [`${filename}`]: null
            };
        }

        this.forceUpdate();
    };

    toggleSelected = (item) => {
        const {image: {filename}} = item;

        if (!this.currSelected[`${filename}`]) {
            this.currSelected = {
                ...this.currSelected,
                [`${filename}`]: item
            };
        } else {
            this.currSelected = {
                ...this.currSelected,
                [`${filename}`]: null
            };
        }
    };

    toggleModal = () => this.setState({modalVisible: !this.state.modalVisible});

    render() {
        console.log('this.state', this.state);
        return (
            <View>
                <ImageSelectModal
                    cameraRollRows={this.state.cameraRollRows}
                    currSelected={this.currSelected}
                    modalVisible={this.state.modalVisible}
                    toggleModal={this.toggleModal}
                    toggleSelected={this.toggleSelected}
                    setSelected={this.setSelected}
                    setCurrSelected={this.setCurrSelected}
                />
                <View style={{height: 75}}/>
                <PlusButton toggleModal={this.toggleModal}/>
                <UploadButton
                    setCurrSelected={this.setCurrSelected}
                    uploadImages={this.uploadImages}
                    selectedImages={this.currSelected}
                />
                <SelectedPreview selectedImages={this.currSelected}/>
            </View>
        );
    }
}

export default withRedux(Home);
