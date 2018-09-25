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
import Login from './Login';
import {SHOULD_AUTHENTICATE} from '../../config';
import Button from '../components/Button';
import UserModal from './UserModal';

class Home extends React.Component {
    componentWillMount() {
        initializeFirebase();
        this.props.actions.setUsers();
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
            imageModalVisible,
            user,
            users,
            userModalVisible
        } = this.props;

        if (this.props.isUploading || (SHOULD_AUTHENTICATE && !users)) {
            return <LoadingView/>;
        }

        if (!this.props.user.loggedIn && SHOULD_AUTHENTICATE) {
            return (
                <Login
                    actions={actions}
                    user={user}
                />
            );
        }

        return (
            <View>
                <ImageSelectModal
                    actions={actions}
                    cameraRollRows={cameraRollRows}
                    selectedImages={selectedImages}
                    imageModalVisible={imageModalVisible}
                />
                <UserModal
                    actions={actions}
                    users={users}
                    userModalVisible={userModalVisible}
                />
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

export default withRedux(Home);
