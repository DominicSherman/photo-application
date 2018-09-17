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

        // Init Firebase
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

    uploadImage = (image, mime = 'gs://wedding-photo-application.appspot.com') => {
        return (dispatch) => {
            return new Promise((resolve, reject) => {
                const uploadUri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;
                const sessionId = new Date().getTime();
                let uploadBlob = null;

                const imageRef = firebase.storage().ref('testing').child(image.filename);

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
                        // return imageRef.getDownloadUrl();
                    })
                    // .then((url) => {
                    //     resolve(url);
                    //     storeReference(url, sessionId, image);
                    // })
                    .catch((error) => {
                        reject(error);
                    })
            })
        }
    };

    uploadImages = () => {
        Object.keys(this.currSelected).forEach(async (key) => {
            const image = this.currSelected[key].image;

            const upload = this.uploadImage(image);
            await upload();
        });
    };

    setCurrSelected = (newCurrSelected) => {
        this.currSelected = newCurrSelected;
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
                    actions={this.props.actions}
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
