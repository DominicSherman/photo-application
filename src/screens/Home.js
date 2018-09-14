import React from 'react';
import {CameraRoll, View} from 'react-native';
import {withRedux} from '../redux-factory';
import {numPictures} from '../constants/variables';
import SelectedPreview from '../components/SelectedPreview';
import PlusButton from '../components/PlusButton';
import UploadButton from '../components/UploadButton';
import ImageSelectModal from './ImageSelectModal';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false
        };
        this.currSelected = {};
    }

    componentDidMount() {
        CameraRoll.getPhotos({
            first: numPictures,
            assetType: 'All',
        }).then((r) => this.props.actions.setCameraRollRows(r));
    }

    setCurrSelected = (newCurrSelected) => {
        this.currSelected = newCurrSelected;
    };

    setSelected = (item, isSelected) => {
        const {image: {filename}} = item;

        if (isSelected) {
            this.currSelected = {
                ...this.currSelected,
                [`${filename}`]: item
            };
        } else {
            this.currSelected = {
                ...this.currSelected,
                [`${filename}`]: null
            };
        }

        this.forceUpdate();
    };

    toggleSelected = (item) => {
        const {image: {filename}} = item;

        if (!this.currSelected[`${filename}`]) {
            this.currSelected = {
                ...this.currSelected,
                [`${filename}`]: item
            };
        } else {
            this.currSelected = {
                ...this.currSelected,
                [`${filename}`]: null
            };
        }
    };

    toggleModal = () => this.setState({modalVisible: !this.state.modalVisible});

    render() {
        return (
            <View>
                <ImageSelectModal
                    cameraRollRows={this.props.cameraRollRows}
                    currSelected={this.currSelected}
                    modalVisible={this.state.modalVisible}
                    toggleModal={this.toggleModal}
                    toggleSelected={this.toggleSelected}
                    setSelected={this.setSelected}
                    setCurrSelected={this.setCurrSelected}
                />
                <View style={{height: 150}}/>
                <PlusButton toggleModal={this.toggleModal}/>
                <UploadButton
                    actions={this.props.actions}
                    setCurrSelected={this.setCurrSelected}
                />
                <SelectedPreview selectedImages={this.currSelected}/>
            </View>
        );
    }
}

export default withRedux(Home);
