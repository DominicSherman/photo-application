import React from 'react';
import {CameraRoll, View} from 'react-native';
import {withRedux} from '../redux-factory';
import {numPictures} from '../constants/variables';
import SelectedPreview from '../components/SelectedPreview';
import PlusButton from '../components/PlusButton';
import UploadButton from '../components/UploadButton';
import ImageSelectModal from './ImageSelectModal';
import {getCameraRollRows, getCurrentTime} from '../constants/helper-functions';
import LoadingView from '../components/LoadingView';
import {initializeFirebase, uploadImage} from '../services/FirebaseUpload';

export class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            cameraRollRows: [],
            numToUpload: 0,
            numFinished: 0,
            isUploading: false,
            progresses: {},
            totals: {}
        };

        this.currSelected = {};
    }

    componentWillMount() {
        initializeFirebase();
    }

    componentDidMount() {
        CameraRoll.getPhotos({
            first: numPictures,
            assetType: 'All',
        }).then((r) => this.setState({cameraRollRows: getCameraRollRows(r)}));
    }

    incrementFinished = () => {
        const currFinished = this.state.numFinished + 1;

        if (currFinished === this.state.numToUpload) {
            this.setState({isUploading: false});
        }

        this.setState({numFinished: currFinished});
    };

    setProgress = (index, bytesTransferred) => {
        this.setState({
            progresses: {
                ...this.state.progresses,
                [index]: bytesTransferred
            }
        });
    };

    setTotal = (index, total) => {
        this.setState({
            totals: {
                ...this.state.totals,
                [index]: total
            }
        });
    };

    setUploading = (numToUpload) => {
        this.setState({numToUpload});
        this.setState({isUploading: true});
    };

    uploadImages = async (selectedImages) => {
        this.setUploading(Object.keys(selectedImages).length);
        const sessionId = getCurrentTime();

        await Object.keys(selectedImages).forEach(async (key, index) => {
            const {image} = selectedImages[key];

            await uploadImage(
                image,
                index,
                sessionId,
                this.incrementFinished,
                this.setProgress,
                this.setTotal);
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
        if (this.state.isUploading) {
            return (
                <LoadingView
                    numFinished={this.state.numFinished}
                    numToUpload={this.state.numToUpload}
                    progresses={this.state.progresses}
                    totals={this.state.totals}
                />
            );
        }

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
