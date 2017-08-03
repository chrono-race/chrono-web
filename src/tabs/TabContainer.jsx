import React from 'react';
import { connect } from 'react-redux';

const tab = (selectedTab, tabTitle, onClick) => (
  <li className={selectedTab === tabTitle ? 'active' : ''}>
    <a onClick={onClick} tabIndex="-1">{tabTitle}</a>
  </li>
);

class TabContainer extends React.Component {
  componentWillMount() {
    this.setState({ selectedTab: '' });
  }

  select(tabTitle) {
    this.setState({ selectedTab: tabTitle });
  }

  createTab(activeTab, child) {
    return tab(activeTab.props.title, child.props.title, () => this.select(child.props.title));
  }

  render() {
    const { selectedTab } = this.state;
    const children = React.Children.toArray(this.props.children);
    let activeTab = children.find(c => c.props.title === selectedTab);
    if (activeTab === undefined) {
      activeTab = children[0];
    }
    const titles = React.Children
      .map(this.props.children, child => this.createTab(activeTab, child));

    return (
      <div className="tab-container">
        <ul className="nav nav-tabs">
          {titles}
        </ul>
        {React.cloneElement(activeTab)}
      </div>
    );
  }
}

export default connect()(TabContainer);
