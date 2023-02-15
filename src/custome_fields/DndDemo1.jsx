import React, { Component } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';

export default class DndDemo1 extends Component {
    constructor() {
        super();
        this.state = {
            items:
                [
                    { id: 0, data: 'Draggable0' },
                    { id: 1, data: 'Draggable1' },
                    { id: 2, data: 'Draggable2' },
                    { id: 3, data: 'Draggable3' },
                    { id: 4, data: 'Draggable4' },
                    { id: 5, data: 'Draggable5' },
                    { id: 6, data: 'Draggable6' },
                    { id: 7, data: 'Draggable7' },
                    { id: 8, data: 'Draggable8' },
                    { id: 9, data: 'Draggable9' },
                    { id: 10, data: 'Draggable10' },
                ]
        }
    }
    render() {
        // console.log(this.state.items)
        const applyDrag = (arr, dragResult) => {
            const { removedIndex, addedIndex, payload } = dragResult;
            if (removedIndex === null && addedIndex === null) return arr;

            const result = [...arr];
            let itemToAdd = payload;

            if (removedIndex !== null) {
                itemToAdd = result.splice(removedIndex, 1)[0];
            }

            if (addedIndex !== null) {
                result.splice(addedIndex, 0, itemToAdd);
            }

            return result;
        };
        return (
            <div>
                <div className="simple-page">
                    <Container onDrop={
                        (e) => {
                            this.setState({ items: applyDrag(this.state.items, e) })
                            console.log(e)
                        }
                    }>
                        {this.state.items.map((value, key) => {
                            return (
                                <Draggable key={value.key}>
                                    <div className="draggable-item">
                                        {value.data}
                                    </div>
                                </Draggable>
                            );
                        })}
                    </Container>
                </div>
            </div>
        );
    }
}