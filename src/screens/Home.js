import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';

import SelectedPreview from '../components/SelectedPreview';
import UploadButton from '../components/UploadButton';
import Button from '../components/Button';

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1
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
                <ScrollView>
                    <Button
                        action={actions.toggleImageModal}
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
