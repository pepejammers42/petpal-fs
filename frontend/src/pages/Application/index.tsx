import { useParams } from "react-router-dom";
import AppDetail from '../../components/AppDetail';
import AppReply from "../../components/AppReply";

function Application(){
    const { appId } = useParams();
    const parsedAppId = parseInt(appId ?? "", 10);
    return (
        <>
            <div className="mx-auto lg:px-4 sm:px-2 pt-16 pb-16">
            <h1 className="text-center text-3xl font-bold pb-4">Application #{appId} Details</h1>
            <AppDetail onUpdateStatus={()=>{}} appId={parsedAppId}/>
            <AppReply />
            </div>
        </>
    )
}

export default Application;