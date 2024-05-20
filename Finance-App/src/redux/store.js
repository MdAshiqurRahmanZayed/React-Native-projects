import { thunk } from 'redux-thunk';
import { rootReducer } from './reducer';
import { createStore ,applyMiddleware} from 'redux';

const Store = createStore(rootReducer,applyMiddleware(thunk));

export default Store;