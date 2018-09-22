import React from 'react';
import {CameraRoll, View} from 'react-native';
import {withRedux} from '../redux-factory';
import {numPictures} from '../constants/variables';
import SelectedPreview from '../components/SelectedPreview';
import PlusButton from '../components/PlusButton';
import UploadButton from '../components/UploadButton';
import ImageSelectModal from './ImageSelectModal';
import {getCameraRollRows} from '../constants/helper-functions';
import LoadingView from './LoadingView';
import {initializeFirebase} from '../services/firebase-service';

class Home extends React.Component {
    componentWillMount() {
        initializeFirebase();
    }

    componentDidMount() {
        CameraRoll.getPhotos({
            first: numPictures,
            assetType: 'All',
        }).then((r) => this.props.actions.setCameraRollRows(r));
    }

    render() {
        const {
            actions,
            cameraRollRows,
            selectedImages,
            modalVisible,
            progresses,
            totals,
            numFinished,
            numToUpload
        } = this.props;

        if (this.props.isUploading) {
            return (
                <LoadingView/>
            );
        }

        return (
            <View>
                <ImageSelectModal
                    actions={actions}
                    cameraRollRows={cameraRollRows}
                    selectedImages={selectedImages}
                    modalVisible={modalVisible}
                />
                <View style={{height: 75}}/>
                <PlusButton toggleModal={actions.toggleModal}/>
                <UploadButton
                    actions={actions}
                    selectedImages={selectedImages}
                />
                <SelectedPreview
                    selectedImages={selectedImages}
                />
            </View>
        );
    }
}

export default withRedux(Home);
