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

let Blob, fs;

export class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false
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
        }).then((r) => this.props.actions.setCameraRollRows(r));
    }

    // storeReference = (downloadUrl, sessionId) => {
    //     const image = {
    //         type: 'image',
    //         url: downloadUrl,
    //         createdAt: sessionId
    //     };
    //     const response = firebase.database().ref(`testing/${image.filename}`).push(image);
    //
    //     console.log('response', response);
    // };

    uploadImage = (image, index, sessionId) => {
        return (dispatch) => {
            return new Promise((resolve, reject) => {
                const mime = 'gs://wedding-photo-application.appspot.com';
                const uploadUri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;
                let uploadBlob = null;

                const imageRef = firebase.storage().ref(`${sessionId}`).child(`${index} - ${image.filename}`);

                console.log('imageRef', imageRef);
                fs.readFile(uploadUri, 'base64')
                    .then((data) => {
                        return Blob.build(data, {type: `${mime};BASE64`});
                    })
                    .then((blob) => {
                        uploadBlob = blob;
                        return imageRef.put(blob, {contentType: mime});
                    })
                    .then(() => {
                        uploadBlob.close();
                        return imageRef.getDownloadURL();
                    })
                    .then((url) => {
                        resolve(url);
                        // this.storeReference(url, sessionId, image);
                    })
                    .catch((error) => {
                        console.log('error', error);
                        reject(error);
                    })
            })
        }
    };

    uploadImages = async (selectedImages) => {
        const sessionId = Date.now();

        console.log('selectedImages', selectedImages);
        await Object.keys(selectedImages).forEach(async (key, index) => {
            const {image} = selectedImages[key];

            console.log('image', image);
            await this.uploadImage(image, index, sessionId)();
        });
        console.log('here');
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
        return (
            <View>
                <ImageSelectModal
                    cameraRollRows={this.props.cameraRollRows}
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
