import './style.scss'
import TableContainer from '../../components/tableContainer'
import { TABLES } from '../../constants';

const Positions = () => {
    return ( 
        <>
            <TableContainer keyWord={TABLES.POSITION}/>
        </>
    );
}
 
export default Positions;