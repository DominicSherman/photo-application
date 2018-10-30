import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Feather from 'react-native-vector-icons/Feather';

import SelectedPreview from '../components/SelectedPreview';
import UploadButton from '../components/UploadButton';
import Button from '../components/Button';
import {logout} from '../services/helper-functions';
import {green, lightFont} from '../constants/style-variables';

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    userButtonWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 20,
        width: '100%'
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
        marginBottom: 10
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
                            {user.name !== '' ?
                                `${user.name} - ${user.email}`
                                :
                                user.email
                            }
                        </Text>
                    </View>
                    {
                        user.isAdmin &&
                        <View style={styles.userButtonWrapper}>
                            <Touchable onPress={actions.toggleUserModal}>
                                <Feather
                                    color={green}
                                    name={'user-plus'}
                                    size={80}
                                />
                            </Touchable>
                        </View>
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
                </ScrollView>
            </SafeAreaView>
        );
    }
}
