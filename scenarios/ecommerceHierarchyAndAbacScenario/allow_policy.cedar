permit (
    principal,
    action in [EcommercePlatform::Action::"Sell"],
    resource
)
when
{
    principal.department == resource.department &&
    principal.rating >= 8 &&
    resource.price > 1000000
};
