import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';

import SelectedPreview from '../components/SelectedPreview';
import UploadButton from '../components/UploadButton';
import Button from '../components/Button';
import {logout} from '../services/helper-functions';
import {lightFont} from '../constants/style-variables';

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    userButtonWrapper: {
        flex: 1,
        height: '100%',
        margin: '10%'
    },
    userText: {
        color: lightFont,
        flex: 1,
        fontSize: 15,
        fontWeight: '200'
    },
    userWrapper: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        padding: 10
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
                    <View style={styles.userWrapper}>
                        <Text style={styles.userText}>
                            {`${user.name} - ${user.email}`}
                        </Text>
                    </View>
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
                    <Button
                        action={() => logout(actions)}
                        fontSize={15}
                        height={20}
                        text={'LOGOUT'}
                        width={40}
                    />
                    {
                        user.isAdmin &&
                        <View style={styles.userButtonWrapper}>
                            <Button
                                action={actions.toggleUserModal}
                                fontSize={15}
                                height={20}
                                text={'USERS'}
                                width={40}
                            />
                        </View>
                    }
                </ScrollView>
            </SafeAreaView>
        );
    }
}
