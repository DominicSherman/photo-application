import React from 'react';
import {ScrollView, Text, View, Dimensions} from 'react-native';

import SelectedPreview from '../components/SelectedPreview';
import UploadButton from '../components/UploadButton';
import Button from '../components/Button';
import {lightFontStyles} from '../constants/font-styles';
import {logout} from '../services/helper-functions';

export default class Home extends React.Component {
    render() {
        const {
            actions,
            selectedImages,
            user
        } = this.props;
        const windowHeight = Dimensions.get('window').height;

        return (
            <View style={{flex: 1}}>
                <ScrollView>
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
                    <View style={{height: '50%'}}>
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
                </ScrollView>
            </View>
        );
    }
}
