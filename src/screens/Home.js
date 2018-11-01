import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';

import SelectedPreview from '../components/SelectedPreview';
import UploadButton from '../components/UploadButton';
import Button from '../components/Button';
import {IMAGE_MODAL} from '../constants/routes';
import {showModal} from '../services/navigation-service';

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    scrollView: {
        paddingTop: '20%'
    }
});

export default class Home extends React.Component {
    render() {
        const {
            actions,
            selectedImages,
            user
        } = this.props;

        return (
            <SafeAreaView style={styles.safeAreaView}>
                <ScrollView style={styles.scrollView}>
                    <Button
                        action={() => showModal(IMAGE_MODAL)}
                        fontSize={18}
                        height={20}
                        text={'Select Images'}
                        width={30}
                    />
                    <UploadButton
                        actions={actions}
                        selectedImages={selectedImages}
                        user={user}
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
