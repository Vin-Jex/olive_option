import { Staff } from "../models/Staff";
import { StaffPermission } from "../models/StaffPermission";
import { hashString } from "../utils/auth";
import { log } from "../utils/logger";

const staffObjects = [
    {
        full_name : "OliveOption Admin",
        email : "admin@oliveoption.com",
        is_admin : true,
        is_active : true,
        password_hash : hashString("12345678")
    },
    {
        full_name : "OliveOption Admin 2",
        email : "curious52019@gmail.com",
        is_admin : true,
        is_active : true,
        password_hash : hashString("12345678")
    }
]

export const seedAdmin = async ()=>{
    for(let i = 0; i < staffObjects.length; i++){
        let staffObject = staffObjects[i];
        let check = await Staff.findOne({ where : { email : staffObject.email } });
    
        if(!check){
            let staff = await Staff.create(staffObject);
            await StaffPermission.create({
                staff_id : staff.id,
                user : true, 
                financial : true,
                affiliate : true,
                trade : true,
                promotional : true
            })
    
            log('info', "Admin seeded");
        }
    }
}