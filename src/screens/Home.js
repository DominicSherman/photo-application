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
import {getUsers, initializeFirebase} from '../services/firebase-service';
import Login from './Login';
import {SHOULD_AUTHENTICATE} from '../../config';

class Home extends React.Component {
    async componentWillMount() {
        initializeFirebase();

        await getUsers().on('value',
            (snapshot) => {
                const users = snapshot.val();
                if (users) {
                    const userEmails = Object.keys(users).map((key) => users[key].email.toLowerCase());

                    this.props.actions.setUsers(userEmails);
                } else {
                    this.props.actions.setUsers({});
                }
            }
        );
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
            modalVisible,
            user,
            users
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
                    modalVisible={modalVisible}
                />
                <View style={{height: 75}}/>
                <PlusButton toggleModal={actions.toggleModal}/>
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
