import {
  CHANGE_MENTOR_STATUS,
  putDataEventAC,
  PUT_DATA_EVENT,
  setDataEventsAC,
  setOrganizersAC,
  SET_DATA_EVENT,
  SET_ORGANIZERS,
} from './../actions/index';
import { scheduleAPI } from './../API/api';

export interface StateModel {
  isMentorStatus: boolean;
  data: any;
  columnsName: string[];
  notEditableColumns: string[];
  ratingVotes: number;
  organizers: string[];
}
const initialState: StateModel = {
  isMentorStatus: false,
  data: [],
  columnsName: [
    'dateTime',
    'timeZone',
    'timeToComplete',
    'type',
    'name',
    'descriptionUrl',
    'course',
    'organizer',
    'place',
    'week',
    'combineScore',
  ],
  notEditableColumns: ['id', 'combineScore'],
  ratingVotes: 0,
  organizers: [],
};

export const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CHANGE_MENTOR_STATUS:
      return {
        ...state,
        isMentorStatus: !state.isMentorStatus,
      };
    case SET_DATA_EVENT: {
      let ratingVotes = 0;
      action.events.map((event: any) => {
        if (event.organizer) {
          const eventMentorArr = event.organizer.split(',').map((mentorId: string) => {
            const mentor = action.organizers.find((mentor: any) => mentor.id === mentorId);

            return !mentor ? ' ' : mentor.name; // проверка если ввел имя которого нет в манторах тогда в имени вернется пустая строка
          });
          event.organizer = eventMentorArr.join(', ');
        }
        if ((event.score && event.score > 0) || (event.maxScore && event.maxScore > 0)) {
          const score = event.score && event.score > 0 ? event.score : 0;
          const maxScore = event.maxScore && event.maxScore > 0 ? event.maxScore : 0;
          const coefficient = event.coefficient && event.coefficient > 0 ? ', coefficient:' + event.coefficient : '';
          event.combineScore = score + '/' + maxScore + coefficient;
        }
        event.key = event.id;
        if (event.rating && event.rating > 0) {
          ratingVotes++;
        }
        return event;
      });
      return { ...state, data: [...action.events], ratingVotes: ratingVotes };
    }
    case PUT_DATA_EVENT: {
      return { ...state };
    }
    case SET_ORGANIZERS: {
      return { ...state, organizers: [...action.organizers] };
    }
    default:
      return state;
  }
};

export const getDataEvent = () => async (dispatch: any) => {
  const events = await scheduleAPI.getDataEvents();
  const organizers = await scheduleAPI.getDataOrganizers();
  dispatch(setDataEventsAC(events, organizers));
};
export const putDataEvent = (idEvent: string, bodyData: object) => async (dispatch: any) => {
  await scheduleAPI.updateDataEvent(idEvent, bodyData);
  dispatch(putDataEventAC(idEvent, bodyData));
};
export const getOrganizers = () => async (dispatch: any) => {
  const organizers = await scheduleAPI.getDataOrganizers();
  dispatch(setOrganizersAC(organizers));
};
