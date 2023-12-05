import { useParams, Link, useNavigate } from "react-router-dom";
import AppDetail from '../../components/AppDetail';
import AppReply from "../../components/AppReply";

function Application(){
    const { appId } = useParams();
    return (
        <>
            <h1 className="text-3xl font-bold mb-4">Application #{appId} Details</h1>
            <AppDetail onUpdateStatus={()=>{}}/>
            <AppReply />
        </>
    )
}

export default Application;