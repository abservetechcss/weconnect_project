import React, { Component } from 'react'
import { Button, FloatingLabel, Form, FormControl, InputGroup } from 'react-bootstrap';
import searchIcon from "../assets/images/search (1).svg";
import downArrow from "../assets/images/Path 48024.svg";
import calenderIcon from "../assets/images/calendar.svg";
import deleteIcon from "../assets/images/trash (1).svg";
import shareIcon from "../assets/images/link.svg";
import plus from "../assets/images/plus (1).svg";
import DatePicker from "react-datepicker";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default class InputFields extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dateRange: [null, null],
            number: 0,
            amount: parseFloat(0.00),
        }
    }
    render() {
        const top100Films = [
            { label: 'The Shawshank Redemption', year: 1994 },
            { label: 'The Godfather', year: 1972 },
            { label: 'The Godfather: Part II', year: 1974 },
            { label: 'The Dark Knight', year: 2008 },
            { label: '12 Angry Men', year: 1957 },
            { label: "Schindler's List", year: 1993 },
            { label: 'Pulp Fiction', year: 1994 },

        ];

        const [startDate, endDate] = this.state.dateRange;
        return (
            <div style={{ padding: '30px' }}>
                <Form.Group className="input-field-block-cust" controlId="formBasicEmail">
                    <Form.Label>Label</Form.Label>
                    <Form.Control type="text" placeholder="Enter text" />
                </Form.Group>

                <Form.Group className="search-block-cust" controlId="formBasicEmail">
                    <Form.Label>Label</Form.Label>
                    <div className="search-field-box">
                        <Form.Control type="text" placeholder="Enter text" />
                        <img src={searchIcon} alt="" />
                    </div>
                </Form.Group>

                <Form.Group className="search-block-cust" controlId="formBasicEmail">
                    <Form.Label>Label</Form.Label>
                    <div className="search-field-box search-field-box2">
                        <img src={searchIcon} alt="" />
                        <Form.Control type="text" placeholder="Enter text" />
                    </div>
                </Form.Group>


                <div className="date-picker-range-block-cust">
                    <div className="icon-block">
                        <img src={calenderIcon} className="calender-icon" alt="" />
                    </div>
                    <div className='date-picker-box' >
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => {
                                // setDateRange(update);
                                this.setState({
                                    dateRange: update,
                                })
                            }}
                            isClearable={true}
                            dateFormat="MMMM d"
                        />
                        <img src={downArrow} alt="" />
                    </div>
                </div>
                <br />
                <br />
                <Form.Group className="select-field-block-cust">
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={top100Films}
                        renderInput={(params) => <TextField {...params} label="Text" />}
                    />
                </Form.Group>
                <br />
                <InputGroup className="inc-desc-field-block-cust">
                    <button class="btn btn-outline-secondary btn-minus"
                        onClick={() => {
                            this.setState({
                                number: this.state.number - 1,
                            })
                        }}
                    >
                        <RemoveIcon />
                    </button>
                    <FormControl type="number" value={this.state.number} />
                    <button class="btn btn-outline-secondary btn-minus"
                        onClick={() => {
                            this.setState({
                                number: this.state.number + 1,
                            })
                        }}
                    >
                        <AddIcon />
                    </button>
                </InputGroup>

                <br />

                <span className="switch-btn-cust">
                    <input type="checkbox" id="switch" /><label htmlFor="switch">Toggle</label>
                </span>
                <br />
                <br />
                <FloatingLabel
                    className="floating-input-field-block-cust"
                    controlId="floatingPassword"
                    label="text"
                >
                    <Form.Control type="text" placeholder="text" />
                </FloatingLabel>
                <br />
                <br />
                <br />
                <FloatingLabel
                    className="floating-input-delete-field-block-cust"
                    controlId="floatingPassword"
                    label="text"
                >
                    <Form.Control type="text" placeholder="text" />
                    <div className='icon-block'>
                        <IconButton>
                            <img src={deleteIcon} alt="" />
                        </IconButton>
                    </div>
                </FloatingLabel>

                <br />
                <FloatingLabel
                    controlId="floatingSelect"
                    label="Language preference"
                    className="floating-select-field-block-cust"
                >
                    <Form.Select aria-label="Floating label select example">
                        <option>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                </FloatingLabel>
                <br />
                <br />
                <br />

                <FloatingLabel
                    controlId="floatingSelect"
                    label="Language preference"
                    className="floating-select-field-block-cust"
                >
                    <Form.Select aria-label="Floating label select example">
                        <option>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                </FloatingLabel>
                <br />
                <br />
                <br />

                <FloatingLabel
                    className="floating-input-link-field-block-cust"
                    controlId="floatingPassword"
                    label="text"
                >
                    <div className='icon-block'>
                        <img src={shareIcon} alt="" />
                    </div>
                    <Form.Control type="text" placeholder="text" />
                </FloatingLabel>

                <br />
                <br />
                <br />

                <FloatingLabel
                    className="floating-input-number-field-block-cust"
                    controlId="floatingPassword"
                    label="text"
                >
                    <Form.Control
                        placeholder="text"
                        type="number"
                        value={this.state.amount}
                        onChange={(e) => {
                            this.setState({
                                amount: parseFloat(e.target.value),
                            })
                        }}
                    />
                    <div className='icon-block'>
                        <KeyboardArrowUpIcon
                            onClick={() => {
                                this.setState({
                                    amount: parseFloat(this.state.amount + 1),
                                })
                            }}
                        />
                        <KeyboardArrowDownIcon
                            onClick={() => {
                                this.setState({
                                    amount: parseFloat(this.state.amount - 1),
                                })
                            }}
                        />
                    </div>
                </FloatingLabel>

                <br />
                <br />
                <br />

                <Form.Group className="input-checkbox-field-block-cust" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="text" />
                </Form.Group>
                <br />
                <br />
                <br />

                <div className="timer-field-block-cust">
                    <label htmlFor="Delay time">Delay time</label>
                    <div class="ms">
                        <input
                            type="number"
                            name="sec"
                            id="seconds"
                            value={this.state.amount}
                            onChange={(e) => {
                                this.setState({
                                    amount: parseFloat(e.target.name)
                                })
                            }}
                        />
                        <div className="arrow-block">
                            <KeyboardArrowDownIcon
                                className="icon up"
                                onClick={() => {
                                    this.setState({
                                        amount: parseFloat(this.state.amount + 1),
                                    })
                                }}
                            />
                            <KeyboardArrowDownIcon
                                className="icon"
                                onClick={() => {
                                    this.setState({
                                        amount: parseFloat(this.state.amount - 1),
                                    })
                                }}
                            />
                        </div>
                    </div>
                </div>

                <br />
                <br />
                <br />

                <Form.Select aria-label="Default select example" className="simple-select-field-block-cust" >
                    <option>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </Form.Select>

                <br />
                <br />
                <br />

                <div className="next-btn-block-cust">
                    <Button variant="text">
                        <img src={plus} alt="" />
                        Add next button</Button>
                </div>

                <br />
                <br />
                <br />

                <div className="pagination-block-cust">
                    <div className="row-page">
                        <label htmlFor="Rows per page">Rows per page</label>
                        <Form.Select aria-label="Default select example" className="simple-select-field-block-cust" >
                            <option value="10" selected>10</option>
                            <option value="15">15</option>
                            <option value="25">25</option>
                        </Form.Select>
                    </div>
                    <div className="pagination">
                        <div className="number-block">
                            <Button variant="light">
                                <ChevronLeftIcon className="icon" />
                            </Button>
                            <Form.Group className="input-field-block-cust" controlId="formBasicEmail">
                                <Form.Control type="text" />
                            </Form.Group>
                            <Button variant="light" disabled className='disabled'>
                                <ChevronRightIcon className="icon" />
                            </Button>
                        </div>
                        <div className="total-page">
                            <label htmlFor="">of 23</label>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
