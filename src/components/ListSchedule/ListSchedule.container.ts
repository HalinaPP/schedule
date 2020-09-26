import { connect } from 'react-redux';
import { getDataEvent } from '../../reducers';
import { ListSchedule } from './ListSchedule';

const mapStateToProps = (state: any) => {
  return {
    isMentorStatus: state.isMentorStatus,
    data: state.data,
  };
};

export const ListScheduleContainer = connect(mapStateToProps, { getDataEvent })(ListSchedule);