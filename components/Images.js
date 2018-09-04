import React, {Component} from 'react';
import {CameraRoll, Image, FlatList, StyleSheet, View, Dimensions, Touchable} from "react-native";
import TouchableImage from './TouchableImage';

const numPictures = 100;
const numPerRow = 3;
const screenSize = Dimensions.get('window').width / numPerRow;

export default class Images extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cameraRollRows: [],
            selectedImages: []
        }
    }

    componentDidMount() {
        const makeRows = (r) => {
            let row = [];
            for (let i = 0; i < r.edges.length; i++) {
                if (r.edges[i]) {
                    if ((i + 1) % numPerRow === 0) {
                        row = [...row, r.edges[i]];
                        this.setState({cameraRollRows: [...this.state.cameraRollRows, row]});
                        row = [];
                    } else {
                        row = [...row, r.edges[i]];
                    }
                }
            }

            this.setState({cameraRollRows: [...this.state.cameraRollRows, row]});
        };

        CameraRoll.getPhotos({
            first: numPictures,
            assetType: 'Photos',
        }).then(r => makeRows(r));
    }

    render() {
        const renderRow = (images) => {
            const Images = () => images.map((item, index) =>
                <TouchableImage
                    item={item}
                    index={index}
                    screenSize={screenSize}
                />
            );

            return (
                <View style={{flexDirection: 'row'}}>
                    <Images/>
                </View>
            );
        };

        return (
            <FlatList
                data={this.state.cameraRollRows}
                keyExtractor={(item) => item[0].node.image.uri}
                renderItem={({item}) =>
                    renderRow(item)
                }
            />
        );
    }
}

const styles = StyleSheet.create({});