import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {CameraRoll, FlatList, Modal, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import {withRedux} from '../redux-factory';
import {numPictures} from '../constants/variables';
import {darkFontStyles} from '../constants/font-styles';
import TouchableImage from '../components/TouchableImage';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false
        };
        this.currSelected = [];
    }

    toggleSelected = (image) => {
        const {image: {filename}} = image;

        if (this.currSelected[`${filename}`]) {
            this.currSelected = {
                ...this.currSelected,
                [`${filename}`]: null
            };
        } else {
            this.currSelected = {
                ...this.currSelected,
                [`${filename}`]: image
            };
        }
    };

    toggleModal = () => {
        this.setState({modalVisible: !this.state.modalVisible});
    };

    _renderRow(images) {
        const Images = () => images.map((item, index) =>
            <TouchableImage
                currSelected={this.currSelected}
                key={index}
                item={item}
                index={index}
                toggleSelected={this.toggleSelected}
            />
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
        const {actions, cameraRollRows} = this.props;
        console.log('this.props', this.props);

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
                                onPress={this.toggleModal}
                            >
                                <EvilIcons
                                    name={'close'}
                                    size={30}
                                />
                            </Touchable>
                            <Text
                                onPress={() => {
                                    actions.setSelectedImages(this.currSelected);
                                    this.toggleModal();
                                }}
                                style={[
                                    darkFontStyles.regular,
                                    {color: 'blue'}
                                ]}
                            >
                                {'Done'}
                            </Text>
                        </View>
                        <FlatList
                            data={cameraRollRows}
                            keyExtractor={(item) => `${item[0].timestamp}`}
                            renderItem={({item}) => this._renderRow(item)}
                        />
                    </SafeAreaView>
                </Modal>
                <Touchable
                    onPress={this.toggleModal}
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
    }
});

export default withRedux(Home);
