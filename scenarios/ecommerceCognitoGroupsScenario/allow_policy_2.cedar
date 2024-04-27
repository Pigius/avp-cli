permit (
    principal in
        BankingTransactionSystem::Group::"<user-pool-goes-here>|transaction_approvers",
    action in [BankingTransactionSystem::Action::"Approve"],
    resource
);
