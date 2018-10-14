import React from 'react';
import {Text, View} from 'react-native';
import SelectedPreview from '../components/SelectedPreview';
import PlusButton from '../components/PlusButton';
import UploadButton from '../components/UploadButton';
import Button from '../components/Button';
import {lightFontStyles} from '../constants/font-styles';
import {logout} from '../constants/helper-functions';

export default class Home extends React.Component {
    render() {
        const {
            actions,
            selectedImages,
            user
        } = this.props;

        return (
            <View>
                <View
                    style={{
                        alignItems: 'center',
                        height: 80,
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={[
                            lightFontStyles.light,
                            {
                                fontSize: 15
                            }]}
                    >
                        {`${user.name} - ${user.email}`}
                    </Text>
                </View>
                {
                    user.isAdmin ?
                        <Button
                            action={actions.toggleUserModal}
                            fontSize={25}
                            height={25}
                            text={'USERS'}
                            width={50}
                        />
                        :
                        null
                }
                <PlusButton toggleImageModal={actions.toggleImageModal} />
                <UploadButton
                    actions={actions}
                    selectedImages={selectedImages}
                    user={user}
                />
                <View style={{height: '37%'}}>
                    <SelectedPreview
                        selectedImages={selectedImages}
                    />
                </View>
                <Button
                    action={() => logout(actions)}
                    fontSize={15}
                    height={20}
                    text={'LOGOUT'}
                    width={40}
                />
            </View>
        );
    }
}
