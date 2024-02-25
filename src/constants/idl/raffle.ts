export type Raffle = {
  "version": "0.1.0",
  "name": "raffle",
  "instructions": [
    {
      "name": "createUser",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createAdmin",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "removeAdmin",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setFee",
      "accounts": [
        {
          "name": "feeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fee1",
          "type": "u64"
        },
        {
          "name": "fee2",
          "type": "u64"
        },
        {
          "name": "fee3",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createRaffle",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "raffleId",
          "type": "u64"
        },
        {
          "name": "startTime",
          "type": "u32"
        },
        {
          "name": "endTime",
          "type": "u32"
        },
        {
          "name": "totalTicket",
          "type": {
            "option": "u32"
          }
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "editRaffle",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "startTime",
          "type": "u32"
        },
        {
          "name": "endTime",
          "type": "u32"
        },
        {
          "name": "totalTicket",
          "type": {
            "option": "u32"
          }
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deleteRaffle",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "buyTicket",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "community",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u32"
        }
      ]
    },
    {
      "name": "setWinner",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "slothash",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimPrize",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimCoode",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "sendBackNft",
      "accounts": [
        {
          "name": "partner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admins",
            "type": {
              "array": [
                "publicKey",
                100
              ]
            }
          },
          {
            "name": "count",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "raffleId",
            "type": "u64"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "startTime",
            "type": "u32"
          },
          {
            "name": "endTime",
            "type": "u32"
          },
          {
            "name": "ticketPrice",
            "type": "u64"
          },
          {
            "name": "buyers",
            "type": {
              "array": [
                {
                  "defined": "Buyer"
                },
                100
              ]
            }
          },
          {
            "name": "count",
            "type": "u32"
          },
          {
            "name": "totalTicket",
            "type": "u32"
          },
          {
            "name": "purchasedTicket",
            "type": "u32"
          },
          {
            "name": "state",
            "type": "u32"
          },
          {
            "name": "minNftCount",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "raffleState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "createFee",
            "type": "u64"
          },
          {
            "name": "claimFee",
            "type": "u64"
          },
          {
            "name": "ticketFee",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Buyer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "publicKey"
          },
          {
            "name": "purchasedTicket",
            "type": "u32"
          },
          {
            "name": "isWinner",
            "type": "u32"
          },
          {
            "name": "claimedPrize",
            "type": "u32"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAmount",
      "msg": "Amount should be bigger than 0"
    },
    {
      "code": 6001,
      "name": "InvalidNft",
      "msg": "Invalid NFT"
    },
    {
      "code": 6002,
      "name": "InsufficientNft",
      "msg": "Insufficient NFT"
    },
    {
      "code": 6003,
      "name": "NotFinishRaffle",
      "msg": "Raffle isn't finished"
    },
    {
      "code": 6004,
      "name": "OverMaxCount",
      "msg": "Over max count"
    },
    {
      "code": 6005,
      "name": "OutOfRaffle",
      "msg": "Raffle had finished or not exist"
    },
    {
      "code": 6006,
      "name": "AlreadySetWinner",
      "msg": "Alreay set winner"
    },
    {
      "code": 6007,
      "name": "SetWinnerError",
      "msg": "Error in set winner"
    },
    {
      "code": 6008,
      "name": "StartedRaffle",
      "msg": "Raffle already started"
    },
    {
      "code": 6009,
      "name": "TooManyTicket",
      "msg": "Too many ticket"
    },
    {
      "code": 6010,
      "name": "NotWinner",
      "msg": "Not winner"
    },
    {
      "code": 6011,
      "name": "ClaimPrizeError",
      "msg": "Error in claim prize"
    },
    {
      "code": 6012,
      "name": "SendBackNftError",
      "msg": "Error in send back nft"
    },
    {
      "code": 6013,
      "name": "OverAdminMaxCount",
      "msg": "Overflow Admin Maxcount!"
    },
    {
      "code": 6014,
      "name": "CreateAdminError",
      "msg": "Create Admin Error!"
    },
    {
      "code": 6015,
      "name": "DeleteAdminError",
      "msg": "Delete Admin Error!"
    }
  ]
};

export const IDL: Raffle = {
  "version": "0.1.0",
  "name": "raffle",
  "instructions": [
    {
      "name": "createUser",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createAdmin",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "removeAdmin",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setFee",
      "accounts": [
        {
          "name": "feeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fee1",
          "type": "u64"
        },
        {
          "name": "fee2",
          "type": "u64"
        },
        {
          "name": "fee3",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createRaffle",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "raffleId",
          "type": "u64"
        },
        {
          "name": "startTime",
          "type": "u32"
        },
        {
          "name": "endTime",
          "type": "u32"
        },
        {
          "name": "totalTicket",
          "type": {
            "option": "u32"
          }
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "editRaffle",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "startTime",
          "type": "u32"
        },
        {
          "name": "endTime",
          "type": "u32"
        },
        {
          "name": "totalTicket",
          "type": {
            "option": "u32"
          }
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deleteRaffle",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "buyTicket",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "community",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u32"
        }
      ]
    },
    {
      "name": "setWinner",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "slothash",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimPrize",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimCoode",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "sendBackNft",
      "accounts": [
        {
          "name": "partner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admins",
            "type": {
              "array": [
                "publicKey",
                100
              ]
            }
          },
          {
            "name": "count",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "raffleId",
            "type": "u64"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "startTime",
            "type": "u32"
          },
          {
            "name": "endTime",
            "type": "u32"
          },
          {
            "name": "ticketPrice",
            "type": "u64"
          },
          {
            "name": "buyers",
            "type": {
              "array": [
                {
                  "defined": "Buyer"
                },
                100
              ]
            }
          },
          {
            "name": "count",
            "type": "u32"
          },
          {
            "name": "totalTicket",
            "type": "u32"
          },
          {
            "name": "purchasedTicket",
            "type": "u32"
          },
          {
            "name": "state",
            "type": "u32"
          },
          {
            "name": "minNftCount",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "raffleState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "createFee",
            "type": "u64"
          },
          {
            "name": "claimFee",
            "type": "u64"
          },
          {
            "name": "ticketFee",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Buyer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "publicKey"
          },
          {
            "name": "purchasedTicket",
            "type": "u32"
          },
          {
            "name": "isWinner",
            "type": "u32"
          },
          {
            "name": "claimedPrize",
            "type": "u32"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAmount",
      "msg": "Amount should be bigger than 0"
    },
    {
      "code": 6001,
      "name": "InvalidNft",
      "msg": "Invalid NFT"
    },
    {
      "code": 6002,
      "name": "InsufficientNft",
      "msg": "Insufficient NFT"
    },
    {
      "code": 6003,
      "name": "NotFinishRaffle",
      "msg": "Raffle isn't finished"
    },
    {
      "code": 6004,
      "name": "OverMaxCount",
      "msg": "Over max count"
    },
    {
      "code": 6005,
      "name": "OutOfRaffle",
      "msg": "Raffle had finished or not exist"
    },
    {
      "code": 6006,
      "name": "AlreadySetWinner",
      "msg": "Alreay set winner"
    },
    {
      "code": 6007,
      "name": "SetWinnerError",
      "msg": "Error in set winner"
    },
    {
      "code": 6008,
      "name": "StartedRaffle",
      "msg": "Raffle already started"
    },
    {
      "code": 6009,
      "name": "TooManyTicket",
      "msg": "Too many ticket"
    },
    {
      "code": 6010,
      "name": "NotWinner",
      "msg": "Not winner"
    },
    {
      "code": 6011,
      "name": "ClaimPrizeError",
      "msg": "Error in claim prize"
    },
    {
      "code": 6012,
      "name": "SendBackNftError",
      "msg": "Error in send back nft"
    },
    {
      "code": 6013,
      "name": "OverAdminMaxCount",
      "msg": "Overflow Admin Maxcount!"
    },
    {
      "code": 6014,
      "name": "CreateAdminError",
      "msg": "Create Admin Error!"
    },
    {
      "code": 6015,
      "name": "DeleteAdminError",
      "msg": "Delete Admin Error!"
    }
  ]
};
