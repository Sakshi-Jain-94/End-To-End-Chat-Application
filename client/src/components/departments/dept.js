import React from 'react';
import deptIcon from '../../images/dept-icon.png';

class Departments extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
      myChat.utils.scrollToBottom()
    }

    chooseDepartment = (event) => {
      const {dept} = event.currentTarget.dataset;
      this.props.data.callback(dept);
      this.props.commonFunctions.deleteComponent(this.props.index);
    }

    render() {
        return (
          <div className="departments full fl">
            <ul className="dept-list">
              <li onClick={this.chooseDepartment} data-dept="bot"><img src={deptIcon} />Holiday Query(Bot)</li>
              <li onClick={this.chooseDepartment} data-dept="agent"><img src={deptIcon} />General Query</li>
            </ul>
          </div>
        );
    }
}

export default Departments;
