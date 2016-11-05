import React from 'react';
import ReactDOM from 'react-dom';
var Infinite = require('react-infinite');

var ListItem = React.createClass({
    getDefaultProps: function() {
        return {
            height: 400,
            lineHeight: "400px",
        }
    },
    render: function() {
        return <div className="post_item">
            <a href={this.props.url} target="_parent">
              <div className="title_handler">
                  <div className="title">
                    {this.props.title}
                  </div>
              </div>
              <img alt="" src={this.props.thumbnail} />
            </a>
        </div>;
    }
});

var InfiniteList = React.createClass({
    getInitialState: function() {
        return {
            elements: [],
            isInfiniteLoading: false,
            apiPage : 1
        }
    },

    getPostsData: function (page, limit) {
      return fetch('https://api.dailymotion.com/videos?page=' + page +
              '&limit=' + limit + '&fields=title,thumbnail_480_url,url' +
              '&language=ar')
            .then((response) => response.json())
            .catch((error) => {
              console.error(error);
            });
    },

    componentDidMount: function() {
      var that = this;
      this.buildElements(that.state.apiPage, 100);
    },

    buildElements: function(start, end) {
        var that = this;
        console.log("buildElements called");
        that.getPostsData(start, end)
          .then((data) => {
            var posts = data.list;
            console.log(posts);
            var elements = [];
            for (var i = 0; i < posts.length; i++) {
                elements.push(<ListItem
                      key={i}
                      index={i}
                      title={posts[i].title}
                      thumbnail={posts[i].thumbnail_480_url}
                      url={posts[i].url}
                      />)
            }

            that.setState({elements:that.state.elements.concat(elements)})
          });

    },

    handleInfiniteLoad: function() {
        console.log("handleInfiniteLoad");
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });
        setTimeout(function() {
            var elemLength = that.state.elements.length,
                newElements = that.buildElements(that.state.apiPage+1, 100);
            that.setState({
                isInfiniteLoading: false,
                apiPage : that.state.apiPage + 1
            });
        }, 1000);
    },

    elementInfiniteLoad: function() {
        return <div className="infinite-list-item">
            Loading...
        </div>;
    },

    render: function() {
        return <Infinite elementHeight={200}
                         containerHeight={1000}
                         infiniteLoadBeginEdgeOffset={1000}
                         onInfiniteLoad={this.handleInfiniteLoad}
                         loadingSpinnerDelegate={this.elementInfiniteLoad()}
                         isInfiniteLoading={this.state.isInfiniteLoading}
                         timeScrollStateLastsForAfterUserScrolls={1000}
                         >
                    {this.state.elements}
                </Infinite>;
    }
});




ReactDOM.render(<InfiniteList/>,
        document.getElementById('infinite-example-one'));
