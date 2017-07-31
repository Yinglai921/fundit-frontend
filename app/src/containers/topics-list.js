import React, { Component } from 'react';
import { connect } from 'react-redux';
//import FixedDataTable from 'fixed-data-table';
import FilterSidebar from './filter-sidebar';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Collapse, Button, CardBlock, Card } from 'reactstrap';

class BSTable extends React.Component {
    render() {
        if (this.props.data.keywords && this.props.data.tags) {
            return (
                <div className="row">
                    <div className="col-md-6">
                        <p> Keywords </p>
                        <ul className="list-group">
                            {this.props.data.keywords.map((keyword) =>{ return( <li className="list-group-item"> {keyword} </li> )})}
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <p> Tags </p>
                        <ul className="list-group">
                            {this.props.data.tags.map((tag) => { return( <li className="list-group-item"> {tag} </li> )})}
                        </ul>
                    </div>
                </div>
            )
        } else if( this.props.data.keywords && !this.props.data.tags){
            return (
                <div className="row">
                    <div className="col-md-6">
                        <p> Keywords </p>
                        <ul className="list-group">
                            {this.props.data.keywords.map((keyword) =>{ return( <li className="list-group-item"> {keyword} </li> )})}
                        </ul>
                    </div>
                </div>
            )
        } else if(!this.props.data.keywords && this.props.data.tags){
            return (
                <div className="row">
                    <div className="col-md-6">
                        <p> Tags </p>
                        <ul className="list-group">
                            {this.props.data.tags.map((tag) =>{ return( <li className="list-group-item"> {tag} </li> )})}
                        </ul>
                    </div>
                </div>
            )
        }
        
        else {
            return (<p>?</p>);
        }
    }
}

class TopicsList extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            cols:[],
            collapse: false
        };

        this._onColumnHeaderChange = this._onColumnHeaderChange.bind(this);
        this.toggle = this.toggle.bind(this);

    }

    toggle(){
        this.setState({ collapse: !this.state.collapse });
    }

    // change the headers of the columns, checkboxes event
    _onColumnHeaderChange(event){
        let col = event.target.value;
        let currentCols = this.state.cols;
        if(event.target.checked){
            if(currentCols.includes(col)){
                return;
            }else{
                currentCols.push(col)
            }
        }else{
            if(currentCols.includes(col)){
                currentCols.splice(currentCols.indexOf(col), 1);
            }
        }
        currentCols.sort();
        this.setState({
            cols: currentCols
        })
    }

    // --- sort by date
    revertSortOpenDate(a, b, order) {   
        a = new Date(a.plannedOpeningDate);
        b = new Date(b.plannedOpeningDate);
        if (order === 'asc') {
            return b - a;
        } else {
            return a - b;
        }
    }

    revertSortDeadlineDate(a, b, order) {   
        a = new Date(a.deadlineDates[0]);
        b = new Date(b.deadlineDates[0]);
        if (order === 'asc') {
            return b - a;
        } else {
            return a - b;
        }
    }

    // --- end of sort by date functions

    // render column according to the checkboxes
    renderColumn(col){

        switch (col){
            case 'plannedOpeningDate':
                return(
                    <TableHeaderColumn 
                    dataField={col} 
                    dataSort 
                    sortFunc={ this.revertSortOpenDate } 
                    expandable={ false }
                    >
                    Planned Opening Date
                    </TableHeaderColumn>
                );
            case 'deadlineDates':
                return(
                    <TableHeaderColumn 
                    dataField={col} 
                    dataSort 
                    sortFunc={ this.revertSortDeadlineDate }
                    expandable={ false }
                    >
                    Deadline Dates
                    </TableHeaderColumn>
                );
            case 'keywords':
                return(
                    <TableHeaderColumn 
                    dataField={col} 
                    filter={ { type: 'RegexFilter', delay: 1000 } } 
                    expandable={ true }
                    >
                    Keywords
                    </TableHeaderColumn> 
                );
            case 'tags':
                return(
                    <TableHeaderColumn 
                    dataField={col} 
                    filter={ { type: 'RegexFilter', delay: 1000 } } 
                    expandable={ true }
                    >
                    Tags
                    </TableHeaderColumn> 
                );
            case 'callTitle':
                return(
                    <TableHeaderColumn 
                    dataField={col}
                    tdStyle={ { whiteSpace: 'normal' } } 
                    filter={ { type: 'RegexFilter', delay: 1000 } } 
                    expandable={ false }
                    >
                    Call Title
                    </TableHeaderColumn> 
                );
        }

    }

    expandComponent(row) {
        let data = {keywords: [], tags: []}
        data.keywords = row.keywords;
        data.tags = row.tags;
        return (
            <BSTable data={ data } />
        );
    }

    linkFormatter(cell, row) {
        return <a href={`http://ec.europa.eu/research/participants/portal4/desktop/en/opportunities/h2020/topics/${row.topicFileName}.html`}>{cell}</a>
    }


    render(){
        const { searchedTopics } = this.props;
        const { cols } = this.state;
        const options = {
            expandRowBgColor: 'rgb(255, 255, 255)',
            expandBy: 'column'  // Currently, available value is row and column, default is row
            };
        console.log("render: ", cols)
        return (

            <div className="row">
                <div className="search-bar col-sm-12">
                    <p> Number of topics: {searchedTopics.length} </p>
                    <br />
                    <div>
                        <Button onClick={this.toggle} style={{ marginBottom: '1rem'}}>
                            <span className="fa fa-cog" aria-hidden="true"></span>
                        </Button>
                        <Collapse isOpen={this.state.collapse}>
                            <Card>
                                <CardBlock>
                                    <form className="form-inline row">
                                        <div className="checkbox col-3">
                                            <label>
                                                <input type="checkbox" value="plannedOpeningDate" 
                                                    onChange={this._onColumnHeaderChange}
                                                /> Planned Opening Date
                                            </label>
                                        </div>
                                        <div className="checkbox col-2">
                                            <label>
                                                <input type="checkbox" value="deadlineDates"
                                                    onChange={this._onColumnHeaderChange}
                                                /> Deadline Dates
                                            </label>
                                        </div>
                                        <div className="checkbox col-2">
                                            <label>
                                                <input type="checkbox" value="tags"
                                                    onChange={this._onColumnHeaderChange}
                                                /> Tags
                                            </label>
                                        </div> 
                                        <div className="checkbox col-2">
                                            <label>
                                                <input type="checkbox" value="keywords"
                                                    onChange={this._onColumnHeaderChange}
                                                /> Keywords
                                            </label>
                                        </div>
                                        <div className="checkbox col-2">
                                            <label>
                                                <input type="checkbox" value="callTitle"
                                                    onChange={this._onColumnHeaderChange}
                                                /> Call Title
                                            </label>
                                        </div>
                                    </form>
                                </CardBlock>
                            </Card>
                        </Collapse>
                    </div>

                    <BootstrapTable 
                        data={ searchedTopics }
                            //striped
                            replace
                            pagination
                        options={ options }
                        expandableRow={ () => { return true; } }
                        expandComponent={ this.expandComponent }
                        >
                        <TableHeaderColumn 
                            dataField='topicId' 
                            isKey
                            hidden
                            >
                            ID
                        </TableHeaderColumn>
                        <TableHeaderColumn 
                            dataField='title' 
                            expandable={ false } 
                            tdStyle={ { whiteSpace: 'normal' } }
                            dataFormat={ this.linkFormatter }
                            >
                            Title
                        </TableHeaderColumn>
                        <TableHeaderColumn 
                            dataField='callStatus' 
                            expandable={ false }
                            dataSort 
                            width='150'
                            >
                            Call Status
                        </TableHeaderColumn>

                        {cols.map((col) => {
                            return this.renderColumn(col)
                        })}

                    </BootstrapTable>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state){
    return{ 
        searchedTopics: state.searchedTopics
    };
}

export default connect(mapStateToProps)(TopicsList);
