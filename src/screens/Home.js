import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, CameraRoll} from 'react-native';

import SelectedPreview from '../components/SelectedPreview';
import UploadButton from '../components/UploadButton';
import Button from '../components/Button';
import {IMAGE_MODAL} from '../constants/routes';
import {showModal} from '../services/navigation-service';
import {numPictures} from '../constants/variables';

import LoadingView from './LoadingView';

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    scrollView: {
        paddingTop: '20%'
    }
});

export default class Home extends React.Component {
    componentDidMount() {
        CameraRoll.getPhotos({
            assetType: 'All',
            first: numPictures
        }).then((r) => this.props.actions.setCameraRollRows(r));
    }

    render() {
        const {
            actions,
            isUploading,
            selectedImages,
            user
        } = this.props;

        if (isUploading) {
            return (
                <LoadingView {...this.props} />
            );
        }

        return (
            <SafeAreaView style={styles.safeAreaView}>
                <ScrollView style={styles.scrollView}>
                    <UploadButton
                        actions={actions}
                        selectedImages={selectedImages}
                        user={user}
                    />
                    <Button
                        action={() => showModal(IMAGE_MODAL)}
                        fontSize={18}
                        height={20}
                        text={'Select Images'}
                        width={30}
                    />
                    <SelectedPreview
                        actions={actions}
                        selectedImages={selectedImages}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}
