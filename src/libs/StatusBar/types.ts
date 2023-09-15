// eslint-disable-next-line no-restricted-imports
import {StatusBar as StatusBarRN} from 'react-native';

type StatusBarExtended = typeof StatusBarRN & {
    getBackgroundColor(): string | symbol | null;
};

const StatusBar = StatusBarRN as StatusBarExtended;

export default StatusBar;
