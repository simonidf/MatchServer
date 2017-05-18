/**
 * Created by simon on 2017/5/17.
 */
function S4()
{
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function NewGuid()
{
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

exports.NewGuid=NewGuid;