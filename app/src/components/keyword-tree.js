import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { saveSvgAsPng } from 'save-svg-as-png';
//import SwitchButton from 'react-switch-button';

import D3KeywordThree from './d3-keyword-tree';
import D3KeywordColorLegend from './d3-keyword-color-legend';

import Navigation from './navigation';
import Footer from './footer';
import { changeFilterTerm, selectKeywords, setColorToggle, fetchKeywordTree } from '../actions';

import KeywordTreeSearch from '../containers/keyword-tree-search';


class KeywordTree extends Component {
  constructor(props){
    super(props);
    this.state = {
      keyword: this.props.searchTerm,
      keywords: this.props.selectedKeywords,
      alertVisible: true,
      colorCheck: this.props.colorToggle,
    }
    this.changeKeyword = this.changeKeyword.bind(this);
    this.selectKeywords = this.selectKeywords.bind(this);
    this.jumpToIndex = this.jumpToIndex.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onColorCheck = this.onColorCheck.bind(this);
    this.addOneKeyword = this.addOneKeyword.bind(this);
  }
  


  componentDidMount(){

    this.props.fetchKeywordTree();
  }

  
  // when clicking a node of the tree graph, get the keyword
  changeKeyword(keyword){

    //let lastOccuranceIndex = keyword.lastIndexOf("(") - 1;
    //keyword = keyword.substring(0, lastOccuranceIndex);
    if(keyword.length > 50){
      keyword = keyword.substring(0, 50);
    }
    keyword = `${keyword.toLowerCase()}`;
    this.props.changeFilterTerm(keyword); // just another name, change the searched term
    this.setState({keyword: keyword});
    this.jumpToIndex();
  }

  selectKeywords(keywordsList){
    
    let newKeywordsList = [];

    keywordsList.forEach((keyword) => {
       let lastOccuranceIndex = keyword.lastIndexOf("(") - 1;
       let word = keyword.substring(0, lastOccuranceIndex);
       newKeywordsList.push(word);
    })

    console.log("keywordsList: ", newKeywordsList)
    this.props.selectKeywords(newKeywordsList);
    this.setState({keywords: newKeywordsList});
  }

  addOneKeyword(keyword, callback){
    let newKeywordsList = this.state.keywords;
    newKeywordsList.push(keyword);
    this.setState({keywords: newKeywordsList});
    this.props.selectKeywords(newKeywordsList);
    callback(keyword);
  }

  jumpToIndex(){
    this.props.history.push('/')
  }

  onDismiss(){
    this.setState({alertVisible: false});
  }

  onColorCheck(e){
    e.preventDefault();
    this.setState({colorCheck: !this.state.colorCheck});
    this.props.setColorToggle(!this.state.colorCheck);
  }

  saveToPng(){
    let svgWidth = document.getElementById("svgGroup").getBoundingClientRect().width + 200;
    let svgHeight = document.getElementById("svgGroup").getBoundingClientRect().height + 200;
    saveSvgAsPng(document.getElementById("diagram"),'chart.png', {width: svgWidth, height: svgHeight});
  }


  render() {
    if (this.props.keywordTree.length === 0){
      return (<p> Loading ... </p>)
    }else{
      return (
        <div className="container-fluid">
            <div className="row">
              <Navigation active={"keyword"}/>
            </div>
            <div className="row">
              <div className="col-sm-12" style={{zIndex: "99"}}>                  
                <h3>Keyword Dictionary</h3>
                <h4> Please select keywords in your field:</h4>
                <p><span className="label label-info">Tips!</span> The values after each keyword: the number of <b> open topics/topics </b> that contain this keyword.</p>
                <KeywordTreeSearch 
                  onChangeKeyword={this.changeKeyword} 
                  onSelectKeywords={this.selectKeywords}
                  keywords={this.state.keywords}
                  data={this.props.keywordTree}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="btn-group" role="group" style={{float: "right", top: "10px"}}>
                    <button type="button" className={this.state.colorCheck ? "btn btn-default" : "btn btn-primary active"} onClick={this.onColorCheck}>Default Graph</button>
                    <button type="button" className={this.state.colorCheck ? "btn btn-primary active" : "btn btn-default"} onClick={this.onColorCheck}>Colored Graph</button>
                </div>

                <div style={{marginTop: "30px", marginLeft: "20px"}} className={this.state.colorCheck? " " : "hidden"}>
                  <p> Number of topics that includes this keyword: </p>
                  <D3KeywordColorLegend />
                </div>
                <div id="keyword-tree-graph">
                    <div className="col-sm-12" style={{textAlign: 'center'}}>
                        <p>
                            <span className="label label-info">Tips!</span> Drag to move, scroll to zoom and double click to recenter the graph.You could also 
                            <span> <button type="button" className="btn btn-default" onClick={this.saveToPng}>Download graph to png</button> </span>
                        </p>
                    </div>
                  <D3KeywordThree onChangeKeyword={this.changeKeyword} data={this.props.keywordTree} keywords={this.state.keywords} onSelectKeywords={this.addOneKeyword} colorToggle={this.state.colorCheck}/>
                </div>
              </div>
            </div>
            <Footer />
        </div>
      );
    }

  }
}

function mapStateToProps(state){
    return{ 
        navigationToggle: state.navigationToggle,
        searchTerm: state.searchTerm,
        selectedKeywords: state.selectedKeywords,
        colorToggle: state.colorToggle,
        keywordTree: state.keywordTree,

    };
}


function mapDispatchToProps(dispatch){
    return bindActionCreators({changeFilterTerm, selectKeywords, setColorToggle, fetchKeywordTree}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(KeywordTree);
