import React from 'react';
import {View} from 'react-native';
import SelectedPreview from '../components/SelectedPreview';
import PlusButton from '../components/PlusButton';
import UploadButton from '../components/UploadButton';
import Button from '../components/Button';

export default class Home extends React.Component {
    render() {
        const {
            actions,
            selectedImages,
            user
        } = this.props;

        return (
            <View>
                <View style={{height: 75}}/>
                {
                    user.isAdmin ?
                        <Button
                            action={actions.toggleUserModal}
                            text={'USERS'}
                            fontSize={25}
                            height={25}
                            width={50}
                        />
                        :
                        null
                }
                <PlusButton toggleImageModal={actions.toggleImageModal}/>
                <UploadButton
                    actions={actions}
                    selectedImages={selectedImages}
                    user={user}
                />
                <SelectedPreview
                    selectedImages={selectedImages}
                />
            </View>
        );
    }
}
