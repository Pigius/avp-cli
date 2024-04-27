permit (
    principal in
        BankingTransactionSystem::Group::"<user-pool-goes-here>|transaction_viewers",
    action in [BankingTransactionSystem::Action::"View"],
    resource
);
