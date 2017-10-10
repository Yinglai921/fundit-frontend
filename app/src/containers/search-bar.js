import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { searchTopics, setSearchTerm, changeSearchScope } from '../actions/index';


class SearchBar extends Component{
    constructor(props){
        super(props);

        this.state = {
            term: this.props.searchTerm,
            scopes: ["title", "keywords", "tags", "description", "open"],
            
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onSearchScopeChange = this.onSearchScopeChange.bind(this);

    }

    // get all the topics after the render
    componentWillMount(){
       // this.props.fetchTopics();
        const { scopes } = this.props;
        let currentScopes = [];
        // if the global scopes has already set, initial the current local state with global scopes state
       
        if(scopes.title !== undefined){
            console.log("initial scope state")
            if(scopes.title){
                currentScopes.push('title')
            }
            if(scopes.keywords){
                currentScopes.push('keywords')
            }
            if(scopes.tags){
                currentScopes.push('tags')
            }
            if(scopes.description){
                currentScopes.push('description')
            }
            if(scopes.open){
                currentScopes.push('open')
            }

            this.setState({
                scopes: currentScopes
            })
        }
        //console.log(this.state.scopes)
    }

    componentDidMount(){
        this.props.searchTopics(this.props.topics, this.state.term, this.state.scopes);
        this.props.changeSearchScope(this.state.scopes);
    }

    onInputChange(event){
        this.setState({term: event.target.value});
    }

    onFormSubmit(event){
        event.preventDefault();

        // console.log("SCOPES: ", this.props.scopes)

        if(this.props.scopes === {} || this.props.scopes.title == false && this.props.scopes.keywords == false && this.props.scopes.tags == false && this.props.scopes.description == false){
            alert("Please select at least one search scope");
        }
        // set search term globally 
        this.props.setSearchTerm(this.state.term);

         console.log("scope STATE before search: ", this.state.scopes)
        // search topics
        this.props.searchTopics(this.props.topics, this.state.term, this.state.scopes);
    } 

    onSearchScopeChange(event){
        let scope = event.target.value;
        let keys = this.state.scopes;
        if(event.target.checked){
            if(keys.includes(scope)){
                return;
            }else{
                keys.push(scope);
            }
        }else{
            if(keys.includes(scope)){
                keys.splice(keys.indexOf(scope), 1);
            }
        }
        this.setState({
            scopes: keys
        })
        this.props.changeSearchScope(this.state.scopes);
        this.props.setSearchTerm(this.state.term);
        //console.log(this.state.scopes)
        this.props.searchTopics(this.props.topics, this.state.term, this.state.scopes);

    }



    render(){
        return(

            <div className="search-bar col-sm-12">
                <form onSubmit={this.onFormSubmit}>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Search topics: </label>
                        <div className="col-sm-8">
                            <input 
                            placeholder='Search...'
                            value={this.state.term}
                            className="form-control"
                            onChange={this.onInputChange}
                            />
                        </div>
                        <div className="col-sm-2">
                            <button type="submit" className="btn btn-primary"> Submit </button>
                        </div>
                    </div>
                </form>

                <div>
                    <span>Search queries: </span>
                        <label className="checkbox-inline">
                            <input type="checkbox" value="title" defaultChecked={this.state.scopes.indexOf("title") == -1 ? false: true}
                                onChange={this.onSearchScopeChange}
                            /> In title
                        </label>

                        <label className="checkbox-inline">
                            <input type="checkbox" value="keywords" defaultChecked={this.state.scopes.indexOf("keywords") == -1 ? false: true}
                                onChange={this.onSearchScopeChange}
                            /> In keywords
                        </label>

                        <label className="checkbox-inline">
                            <input type="checkbox" value="tags" defaultChecked={this.state.scopes.indexOf("tags") == -1 ? false: true}
                                onChange={this.onSearchScopeChange}
                            /> In tags
                        </label>
                        <label className="checkbox-inline">
                            <input type="checkbox" value="description" defaultChecked={this.state.scopes.indexOf("description") == -1 ? false: true}
                                onChange={this.onSearchScopeChange}
                            /> In descriptions
                        </label>
                </div>
                    <span> Limit the search results: </span>
                            <label className="checkbox-inline">
                                <input type="checkbox" value="open" defaultChecked={this.state.scopes.indexOf("open") == -1 ? false: true}
                                    onChange={this.onSearchScopeChange}
                                /> In open topics
                            </label>
                <div>
                </div>
            </div>
        )
    }
}

function mapStatetoProps(state){
    return { 
        topics: state.topics,
        scopes: state.scopes,
        filters: state.filters,
        searchTerm: state.searchTerm,
     }
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({searchTopics, setSearchTerm, changeSearchScope}, dispatch);
}

export default connect(mapStatetoProps, mapDispatchToProps)(SearchBar);