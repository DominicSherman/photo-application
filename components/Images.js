import React, {Component} from 'react';
import {CameraRoll, Image, FlatList, StyleSheet, View} from "react-native";

const numPictures = 12;

export default class Images extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cameraRollRows: []
        }
    }

    componentDidMount() {
        CameraRoll.getPhotos({
            first: numPictures,
            assetType: 'Photos',
        }).then(r => {
            let row = [];
            for (let i = 1; i <= numPictures; i++) {
                if (r.edges[i - 1]) {
                    if (i % 4 === 0) {
                        row = [...row, r.edges[i - 1]];
                        this.setState({cameraRollRows: [...this.state.cameraRollRows, row]});
                        row = [];
                    } else {
                        row = [...row, r.edges[i - 1]];
                    }
                } else {
                    if (row.length) {
                        this.setState({cameraRollRows: [...this.state.cameraRollRows, row]});
                        row = [];
                    }
                }
            }
        })
    }

    renderRow(images) {
        const Images = () => images.map((item, index) =>
            <Image
                key={index}
                style={{
                    width: 100,
                    height: 100
                }}
                source={{uri: item.node.image.uri}}
            />
        );

        return (
            <View style={{flexDirection: 'row'}}>
                <Images/>
            </View>
        );
    }

    render() {
        return (
            <FlatList
                data={this.state.cameraRollRows}
                keyExtractor={(item) => item[0].node.image.uri}
                renderItem={({item}) =>
                    this.renderRow(item)
                }
            />
        );
    }
}

const styles = StyleSheet.create({});