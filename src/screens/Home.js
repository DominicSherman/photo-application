import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';

import SelectedPreview from '../components/SelectedPreview';
import UploadButton from '../components/UploadButton';
import Button from '../components/Button';
import {logout} from '../services/helper-functions';
import {lightFont} from '../constants/style-variables';

const styles = StyleSheet.create({
    userText: {
        color: lightFont,
        fontSize: 15,
        fontWeight: '200'
    },
    userWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '3%'
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
            <SafeAreaView style={{flex: 1}}>
                <ScrollView>
                    <View style={styles.userWrapper}>
                        <Text style={styles.userText}>
                            {`${user.name} - ${user.email}`}
                        </Text>
                    </View>
                    {
                        user.isAdmin &&
                        <Button
                            action={actions.toggleUserModal}
                            fontSize={25}
                            height={25}
                            text={'USERS'}
                            width={50}
                        />
                    }
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
                        selectedImages={selectedImages}
                    />
                    <Button
                        action={() => logout(actions)}
                        fontSize={15}
                        height={20}
                        text={'LOGOUT'}
                        width={40}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}
