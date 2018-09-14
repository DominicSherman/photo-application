import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {
    CameraRoll,
    FlatList,
    ImageBackground,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import {withRedux} from '../redux-factory';
import {numPictures, screenSize} from '../constants/variables';
import {darkFontStyles} from '../constants/font-styles';

let selectedImages = [];

class Home extends React.Component {
    state = {
        modalVisible: false
    };

    toggleSelected = (image) => {
        const {image: {filename}} = image;

        if (selectedImages[`${filename}`]) {
            selectedImages = {
                ...selectedImages,
                [`${filename}`]: null
            };
        } else {
            selectedImages = {
                ...selectedImages,
                [`${filename}`]: image
            };
        }
    };

    _renderRow(images) {
        console.log('selectedImages', selectedImages);
        const Images = () => images.map((item, index) =>
            <TouchableOpacity
                onPress={() => this.toggleSelected(item)}
            >
                {selectedImages[item.image.filename] ?
                    <ImageBackground
                        key={index}
                        style={{
                            width: screenSize,
                            height: screenSize
                        }}
                        source={{uri: item.image.uri}}
                    >
                        <View style={styles.overlay}>
                            <Entypo
                                name={'check'}
                                style={styles.icon}
                            />
                        </View>
                    </ImageBackground>
                    :
                    <ImageBackground
                        key={index}
                        style={{
                            width: screenSize,
                            height: screenSize
                        }}
                        source={{uri: item.image.uri}}
                    />
                }
            </TouchableOpacity>
        );

        return (
            <View style={{flexDirection: 'row'}}>
                <Images/>
            </View>
        );
    };

    componentDidMount() {
        CameraRoll.getPhotos({
            first: numPictures,
            assetType: 'All',
        }).then((r) => this.props.actions.setCameraRollRows(r));
    }

    render() {
        console.log('this.props', this.props);
        console.log('selectedImages', selectedImages);
        const {actions, cameraRollRows} = this.props;

        return (
            <View style={styles.wrapper}>
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.modalVisible}
                >
                    <SafeAreaView>
                        <View style={styles.header}>
                            <Touchable
                                onPress={() => this.setState({modalVisible: false})}
                            >
                                <EvilIcons
                                    name={'close'}
                                    size={30}
                                />
                            </Touchable>
                            <Text
                                style={darkFontStyles.regular}
                                onPress={() =>  {
                                    actions.uploadImages(selectedImages);
                                    this.setState({modalVisible: false})
                                }}
                            >
                                {'Done'}
                            </Text>
                        </View>
                        <FlatList
                            data={cameraRollRows}
                            extraData={selectedImages}
                            style={{paddingBottom: '12%'}}
                            keyExtractor={(item) => `${item[0].timestamp}`}
                            renderItem={({item}) => this._renderRow(item)}
                        />
                    </SafeAreaView>
                </Modal>
                <Touchable
                    onPress={() => this.setState({modalVisible: true})}
                >
                    <Entypo
                        size={40}
                        name={'circle-with-plus'}
                    />
                </Touchable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignContent: 'center'
    },
    wrapper: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    icon: {
        fontSize: 40,
        color: 'green',
        opacity: 1
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
    }
});

export default withRedux(Home);
