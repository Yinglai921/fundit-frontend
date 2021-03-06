import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { searchTopics, setSearchTerm, changeSearchScope } from '../actions/index';
import queryString from 'query-string';
import Tooltip from '../components/tools/tooltip';

class SearchBar extends Component{
    constructor(props){
        super(props);

        this.state = {
            term: this.props.searchTerm,
            scopes: ["title", "identifier", "keywords", "tags", "description", "open"]
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onSearchScopeChange = this.onSearchScopeChange.bind(this);

    }

    // get all the topics after the render
    componentWillMount(){
       // detect if the search works
       if (this.props.queries !== ""){
            const parsedQueries = queryString.parse(this.props.queries);
            console.log(parsedQueries)
            this.setState({
                term: parsedQueries.term
            })

            let currentScopes = [];
        
            if(parsedQueries.title === 'true'){
                currentScopes.push('title')
            }
            if(parsedQueries.identifier === 'true'){
                currentScopes.push('identifier')
            }
            if(parsedQueries.keywords === 'true'){
                currentScopes.push('keywords')
            }
            if(parsedQueries.tags === 'true'){
                currentScopes.push('tags')
            }
            if(parsedQueries.desc === 'true'){
                currentScopes.push('description')
            }
            if(parsedQueries.open === 'true'){
                currentScopes.push('open')
            }

            this.setState({
                scopes: currentScopes
            })

       } else{
            const { scopes } = this.props;
            let currentScopes = [];
            // if the global scopes has already set, initial the current local state with global scopes state
        
            if(scopes.title !== undefined){
                console.log("initial scope state")
                if(scopes.title){
                    currentScopes.push('title')
                }
                if(scopes.identifier){
                    currentScopes.push('identifier')
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
       }
        
        //console.log(this.state.scopes)
    }

    componentDidMount(){
        console.log(this.state.term)
        console.log(this.state.scopes)
        this.props.searchTopics(this.state.term, this.state.scopes, this.props.history);
        this.props.changeSearchScope(this.state.scopes);

    }

    onInputChange(event){
        this.setState({term: event.target.value});
    }

    onFormSubmit(event){
        event.preventDefault();

        // console.log("SCOPES: ", this.props.scopes)

        if(this.props.scopes === {} || this.props.scopes.title === false && this.props.scopes.identifier === false && this.props.scopes.keywords == false && this.props.scopes.tags === false && this.props.scopes.description === false){
            alert("Please select at least one search scope");
        }
        // set search term globally 
        this.props.setSearchTerm(this.state.term);
        
        // search topics
        this.props.searchTopics(this.state.term, this.state.scopes, this.props.history);
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
        this.props.searchTopics(this.state.term, this.state.scopes, this.props.history);

    }



    render(){
        return(

            <div className={ this.props.searchedTopics.length === 0 ? "search-bar col-sm-12 search-top-margin jumbotron" : "search-bar col-sm-12" } >
                <div className={ this.props.searchedTopics.length === 0 ? "text-center" : "hidden" } > 
                    <h1>FUNDIT</h1>
                    <h4> Find Horizon H2020 Topics </h4>
                </div>
                <form onSubmit={this.onFormSubmit} className={ this.props.searchedTopics.length === 0 ? "top-margin" : " " }>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Search H2020 topics: </label>
                        <div className="col-sm-8">
                            <input 
                            placeholder='e.g. information OR security OR data NOT space'
                            value={this.state.term}
                            className="form-control"
                            onChange={this.onInputChange}
                            />
                        </div>
                        <div className="col-sm-2">
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </div>
                </form>

                <div>
                    <span>Search queries: </span>
                        <label className="checkbox-inline">
                            <input type="checkbox" value="title" defaultChecked={this.state.scopes.indexOf("title") === -1 ? false: true}
                                onChange={this.onSearchScopeChange}
                            /> 
                            <Tooltip 
                            term="In title" 
                            explain="The titles of topics."/>
                        </label>

                        <label className="checkbox-inline">
                            <input type="checkbox" value="identifier" defaultChecked={this.state.scopes.indexOf("identifier") === -1 ? false: true}
                                onChange={this.onSearchScopeChange}
                            /> 
                            <Tooltip 
                            term="In topic identifier" 
                            explain="The identifier of topics."/>
                        </label>

                        <label className="checkbox-inline">
                            <input type="checkbox" value="keywords" defaultChecked={this.state.scopes.indexOf("keywords") === -1 ? false: true}
                                onChange={this.onSearchScopeChange}
                            /> 
                            <Tooltip 
                            term="In keywords" 
                            explain="The official keywords which are used in the proposals, projects and expert profiles in the context of EU grants.</br> Click here to <a href='https://fundit.proj.kth.se/#/user-guide'> Read more </a>"/>
                        </label>

                        <label className="checkbox-inline">
                            <input type="checkbox" value="tags" defaultChecked={this.state.scopes.indexOf("tags") === -1 ? false: true}
                                onChange={this.onSearchScopeChange}
                            /> <Tooltip 
                            term="In tags" 
                            explain="List of tags associated with the topic."/>
                        </label>
                        <label className="checkbox-inline">
                            <input type="checkbox" value="description" defaultChecked={this.state.scopes.indexOf("description") === -1 ? false: true}
                                onChange={this.onSearchScopeChange}
                            /> <Tooltip 
                            term="In descriptions" 
                            explain="The descriptions of the topics."/>
                        </label>
                </div>
                    <span> Limit the search results: </span>
                            <label className="checkbox-inline">
                                <input type="checkbox" value="open" defaultChecked={this.state.scopes.indexOf("open") === -1 ? false: true}
                                    onChange={this.onSearchScopeChange}
                                /> <Tooltip 
                                term="In open and forthcoming topics" 
                                explain="The topic status is associated with call status, the call has open, forthcoming and closed status."/>
                            </label>
                <div>
                </div>
            </div>
        )
    }
}

function mapStatetoProps(state){
    return { 
        searchedTopics: state.searchedTopics,
        scopes: state.scopes,
        filters: state.filters,
        searchTerm: state.searchTerm,
     }
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({searchTopics, setSearchTerm, changeSearchScope}, dispatch);
}

export default connect(mapStatetoProps, mapDispatchToProps)(SearchBar);