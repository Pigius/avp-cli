permit (
    principal in
        BankingTransactionSystem::Group::"<user-pool-goes-here>|transaction_editors",
    action in [BankingTransactionSystem::Action::"Edit"],
    resource
);
