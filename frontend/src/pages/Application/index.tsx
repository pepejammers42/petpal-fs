import { useParams } from "react-router-dom";
import AppDetail from '../../components/AppDetail';
import AppReply from "../../components/AppReply";

function Application(){
    const { appId } = useParams();
    const parsedAppId = parseInt(appId ?? "", 10);
    return (
        <>
            <h1 className="text-3xl font-bold mb-4">Application #{appId} Details</h1>
            <AppDetail onUpdateStatus={()=>{}} appId={parsedAppId}/>
            <AppReply />
        </>
    )
}

export default Application;