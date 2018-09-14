import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {CameraRoll, FlatList, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import {withRedux} from '../redux-factory';
import {numPictures, thumbnailImageSize} from '../constants/variables';
import {darkFontStyles} from '../constants/font-styles';
import TouchableImage from '../components/TouchableImage';
import SelectedPreview from '../components/SelectedPreview';

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

    toggleModal = () => {
        this.setState({modalVisible: !this.state.modalVisible});
    };

    renderRow = (images) => {
        let isSelected = true;
        images.forEach((i) => !this.currSelected[i.image.filename] ? isSelected = false : null);

        return (
            <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                    {!isSelected ?
                        <Touchable
                            onPress={() => {
                                images.forEach((i) => this.setSelected(i, true));
                                this.forceUpdate();
                            }}
                        >
                            <Entypo
                                size={20}
                                color={'green'}
                                name={'circle-with-plus'}
                            />
                        </Touchable>
                        :
                        <Touchable
                            onPress={() => {
                                images.forEach((i) => this.setSelected(i, false));
                                this.forceUpdate();
                            }}
                        >
                            <Entypo
                                size={20}
                                color={'red'}
                                name={'circle-with-minus'}
                            />
                        </Touchable>
                    }
                </View>
                {
                    images.map((item) =>
                        <TouchableImage
                            key={`${item.image.filename}`}
                            item={item}
                            selected={this.currSelected[item.image.filename]}
                            toggleSelected={this.toggleSelected}
                        />
                    )
                }
            </View>
        );
    };

    render() {
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
                                onPress={() => {
                                    this.toggleModal();
                                    this.currSelected = [];
                                }}
                            >
                                <EvilIcons
                                    name={'close'}
                                    size={30}
                                />
                            </Touchable>
                            <Text
                                onPress={this.toggleModal}
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
                            extraData={this.currSelected}
                            keyExtractor={(item) => `${item[0].timestamp}`}
                            renderItem={({item}) => this.renderRow(item)}
                        />
                    </SafeAreaView>
                </Modal>

                <View style={{height: 150}}/>
                <View style={styles.centeredRow}>
                    <Touchable
                        onPress={this.toggleModal}
                    >
                        <Entypo
                            size={60}
                            name={'circle-with-plus'}
                        />
                    </Touchable>
                </View>
                <View style={styles.centeredRow}>
                    <Touchable
                        onPress={() => {
                            actions.setSelectedImages(this.currSelected);
                            this.currSelected = [];
                        }}
                    >
                        <View style={styles.buttonView}>
                            <Text
                                style={[
                                    darkFontStyles.regular,
                                    {color: 'white', fontSize: 30}
                                ]}
                            >
                                {'UPLOAD'}
                            </Text>
                        </View>
                    </Touchable>
                </View>
                <SelectedPreview selectedImages={this.currSelected}/>
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
        justifyContent: 'center'
    },
    buttonView: {
        width: '100%',
        paddingVertical: 40,
        paddingHorizontal: 80,
        borderColor: '#678da2',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#678da2',
        justifyContent: 'center'
    },
    centeredRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50
    }
});

export default withRedux(Home);
