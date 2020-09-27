const switchTypeToColor = (typeName: string) => {
  let color = typeName;
  switch (typeName) {
    case 'live':
    case 'youtube live':
    case 'self education':
    case 'html/css academy':
      color = 'blue';
      break;
    case 'deadline':
      color = 'magenta';
      break;
    case 'выдача таска':
    case 'codewars':
    case 'CodeJam':
    case 'js task':
    case 'html task':
    case 'task':
      color = 'green';
      break;
    case 'test':
    case 'final test':
      color = 'geekblue';
      break;
    case 'cross-check':
    case 'markdown':
    case 'html':
      color = 'purple';
      break;
    case 'регистрация':
    case 'митап':
      color = 'gold';
      break;
    case 'stage-interview':
    case 'interview':
      color = 'volcano';
      break;
    default:
      color = 'lime';
  }
  return color;
};

const typesTag = [
  { type: 'live', color: 'blue' },
  { type: 'youtube live', color: 'blue' },
  { type: 'self education', color: 'blue' },
  { type: 'html/css academy', color: 'blue' },
  { type: 'deadline', color: 'magenta' },
  { type: 'выдача таска', color: 'green' },
  { type: 'codewars', color: 'green' },
  { type: 'CodeJam', color: 'green' },
  { type: 'js task', color: 'green' },
  { type: 'html task', color: 'green' },
  { type: 'task', color: 'green' },
  { type: 'test', color: 'geekblue' },
  { type: 'final test', color: 'geekblue' },
  { type: 'cross-check', color: 'purple' },
  { type: 'markdown', color: 'purple' },
  { type: 'html', color: 'purple' },
  { type: 'регистрация', color: 'gold' },
  { type: 'митап', color: 'gold' },
  { type: 'stage-interview', color: 'volcano' },
  { type: 'interview', color: 'volcano' },
];

const dateAndTimeFormat = 'YYYY.MM.DD hh:mm';

const columnSetWidth = (columnName: string, widthScreen: number) => {
  switch (columnName) {
    case 'course':
      return `10%`;
    case 'isShowFeedback' || 'maxScore' || 'place' || 'rating' || 'studentScore' || 'taskContent' || 'timeZone':
      return `7%`;
    case 'name':
      return `10%`;
    case 'descriptionUrl':
      return '15%';
    case 'organizer':
      return `10%`;
    case 'timeToComplete':
      return `10%`;
    case 'week':
      return `5%`;
    case 'dateTime':
      return `10%`;
    case 'Type':
      return `15%`;
    default:
      return 'auto';
  }
};
export { switchTypeToColor, typesTag, dateAndTimeFormat, columnSetWidth };
