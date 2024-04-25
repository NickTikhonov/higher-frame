import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'neynar/2.0 (api/6.1.1)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Fetches fid to assign it new user
   *
   * @summary Fetches fid to assign it new user
   * @throws FetchError<500, types.GetFreshFidResponse500> Server Error
   */
  getFreshFid(metadata: types.GetFreshFidMetadataParam): Promise<FetchResponse<200, types.GetFreshFidResponse200>> {
    return this.core.fetch('/farcaster/user/fid', 'get', metadata);
  }

  /**
   * Fetches the status of a developer managed signer by public key
   *
   * @summary Fetches the status of a signer by public key
   * @throws FetchError<400, types.DeveloperManagedSignerResponse400> Bad Request
   */
  developerManagedSigner(metadata: types.DeveloperManagedSignerMetadataParam): Promise<FetchResponse<200, types.DeveloperManagedSignerResponse200>> {
    return this.core.fetch('/farcaster/signer/developer_managed', 'get', metadata);
  }

  /**
   * Registers an signed key and returns the developer managed signer status with an approval
   * url.
   *
   * @summary Registers Signed Key
   * @throws FetchError<400, types.RegisterSignedKeyForDeveloperManagedSignerResponse400> Bad Request
   * @throws FetchError<500, types.RegisterSignedKeyForDeveloperManagedSignerResponse500> Server Error
   */
  registerSignedKeyForDeveloperManagedSigner(body: types.RegisterSignedKeyForDeveloperManagedSignerBodyParam, metadata: types.RegisterSignedKeyForDeveloperManagedSignerMetadataParam): Promise<FetchResponse<200, types.RegisterSignedKeyForDeveloperManagedSignerResponse200>> {
    return this.core.fetch('/farcaster/signer/developer_managed/signed_key', 'post', body, metadata);
  }

  /**
   * Gets information status of a signer by passing in a signer_uuid (Use post API to
   * generate a signer)
   *
   * @summary Fetches the status of a signer
   * @throws FetchError<400, types.SignerResponse400> Bad Request
   * @throws FetchError<403, types.SignerResponse403> Forbidden
   * @throws FetchError<404, types.SignerResponse404> Resource not found
   * @throws FetchError<500, types.SignerResponse500> Server Error
   */
  signer(metadata: types.SignerMetadataParam): Promise<FetchResponse<200, types.SignerResponse200>> {
    return this.core.fetch('/farcaster/signer', 'get', metadata);
  }

  /**
   * Creates a signer and returns the signer status. \
   * **Note**: While tesing please reuse the signer, it costs money to approve a signer.
   *
   *
   * @summary Creates a signer and returns the signer status
   * @throws FetchError<500, types.CreateSignerResponse500> Server Error
   */
  createSigner(metadata: types.CreateSignerMetadataParam): Promise<FetchResponse<200, types.CreateSignerResponse200>> {
    return this.core.fetch('/farcaster/signer', 'post', metadata);
  }

  /**
   * Registers an app fid, deadline and a signature. Returns the signer status with an
   * approval url.
   *
   * @summary Register Signed Key
   * @throws FetchError<400, types.RegisterSignedKeyResponse400> Bad Request
   * @throws FetchError<403, types.RegisterSignedKeyResponse403> Forbidden
   * @throws FetchError<404, types.RegisterSignedKeyResponse404> Resource not found
   * @throws FetchError<500, types.RegisterSignedKeyResponse500> Server Error
   */
  registerSignedKey(body: types.RegisterSignedKeyBodyParam, metadata: types.RegisterSignedKeyMetadataParam): Promise<FetchResponse<200, types.RegisterSignedKeyResponse200>> {
    return this.core.fetch('/farcaster/signer/signed_key', 'post', body, metadata);
  }

  /**
   * Search for Usernames
   *
   * @summary Search for Usernames
   * @throws FetchError<400, types.UserSearchResponse400> Bad Request
   */
  userSearch(metadata: types.UserSearchMetadataParam): Promise<FetchResponse<200, types.UserSearchResponse200>> {
    return this.core.fetch('/farcaster/user/search', 'get', metadata);
  }

  /**
   * Fetches information about multiple users based on FIDs
   *
   * @summary Fetch users based on FIDs
   * @throws FetchError<400, types.UserBulkResponse400> Bad Request
   */
  userBulk(metadata: types.UserBulkMetadataParam): Promise<FetchResponse<200, types.UserBulkResponse200>> {
    return this.core.fetch('/farcaster/user/bulk', 'get', metadata);
  }

  /**
   * Fetches power users based on Warpcast power badges
   *
   * @summary Fetch power users
   * @throws FetchError<400, types.PowerUsersResponse400> Bad Request
   */
  powerUsers(metadata: types.PowerUsersMetadataParam): Promise<FetchResponse<200, types.PowerUsersResponse200>> {
    return this.core.fetch('/farcaster/user/power', 'get', metadata);
  }

  /**
   * Fetches active users based on Warpcast active algorithm, information is updated every 12
   * hours
   *
   * @summary Fetch active users
   * @throws FetchError<400, types.ActiveUsersResponse400> Bad Request
   */
  activeUsers(metadata: types.ActiveUsersMetadataParam): Promise<FetchResponse<200, types.ActiveUsersResponse200>> {
    return this.core.fetch('/farcaster/user/active', 'get', metadata);
  }

  /**
   * Fetches all users based on multiple Ethereum or Solana addresses.
   *
   * Each farcaster user has a custody Ethereum address and optionally verified Ethereum or
   * Solana addresses. This endpoint returns all users that have any of the given addresses
   * as their custody or verified Ethereum or Solana addresses.
   *
   * A custody address can be associated with only 1 farcaster user at a time but a verified
   * address can be associated with multiple users.
   * You can pass in Ethereum and Solana addresses, comma separated, in the same request. The
   * response will contain users associated with the given addresses.
   *
   * @summary Fetches users based on Eth or Sol addresses
   * @throws FetchError<400, types.UserBulkByAddressResponse400> Bad Request
   * @throws FetchError<404, types.UserBulkByAddressResponse404> Resource not found
   */
  userBulkByAddress(metadata: types.UserBulkByAddressMetadataParam): Promise<FetchResponse<200, types.UserBulkByAddressResponse200>> {
    return this.core.fetch('/farcaster/user/bulk-by-address', 'get', metadata);
  }

  /**
   * Returns a list of all channels with their details that a fid follows.
   *
   * @summary Retrieve all channels that a given fid follows
   */
  userChannels(metadata: types.UserChannelsMetadataParam): Promise<FetchResponse<200, types.UserChannelsResponse200>> {
    return this.core.fetch('/farcaster/user/channels', 'get', metadata);
  }

  /**
   * Update user profile \
   * (In order to update user's profile `signer_uuid` must be approved)
   *
   *
   * @summary Update user profile
   * @throws FetchError<400, types.UpdateUserResponse400> Bad Request
   * @throws FetchError<403, types.UpdateUserResponse403> Forbidden
   * @throws FetchError<404, types.UpdateUserResponse404> Resource not found
   * @throws FetchError<500, types.UpdateUserResponse500> Server Error
   */
  updateUser(body: types.UpdateUserBodyParam, metadata: types.UpdateUserMetadataParam): Promise<FetchResponse<200, types.UpdateUserResponse200>> {
    return this.core.fetch('/farcaster/user', 'patch', body, metadata);
  }

  /**
   * Register account on farcaster.
   *
   *
   * @summary Register account on farcaster
   * @throws FetchError<400, types.RegisterUserResponse400> Bad Request
   * @throws FetchError<401, types.RegisterUserResponse401> Unauthorized
   * @throws FetchError<404, types.RegisterUserResponse404> Resource not found
   * @throws FetchError<409, types.RegisterUserResponse409> Conflict
   * @throws FetchError<500, types.RegisterUserResponse500> Server Error
   */
  registerUser(body: types.RegisterUserBodyParam, metadata: types.RegisterUserMetadataParam): Promise<FetchResponse<200, types.RegisterUserResponse200>> {
    return this.core.fetch('/farcaster/user', 'post', body, metadata);
  }

  /**
   * Publish a message to farcaster. The message must be signed by a signer managed by the
   * developer. Use the @farcaster/core library to construct and sign the message. Use the
   * Message.toJSON method on the signed message and pass the JSON in the body of this POST
   * request.
   *
   * @summary Publish a message to farcaster
   * @throws FetchError<400, types.PublishMessageResponse400> Bad Request
   * @throws FetchError<500, types.PublishMessageResponse500> Server Error
   */
  publishMessage(body: types.PublishMessageBodyParam, metadata: types.PublishMessageMetadataParam): Promise<FetchResponse<200, types.PublishMessageResponse200>> {
    return this.core.fetch('/farcaster/message', 'post', body, metadata);
  }

  /**
   * Gets information about an individual cast by passing in a Warpcast web URL or cast hash
   *
   * @summary Retrieve cast for a given hash or Warpcast URL
   * @throws FetchError<400, types.CastResponse400> Bad Request
   */
  cast(metadata: types.CastMetadataParam): Promise<FetchResponse<200, types.CastResponse200>> {
    return this.core.fetch('/farcaster/cast', 'get', metadata);
  }

  /**
   * Posts a cast or cast reply. Works with mentions and embeds.  
   * (In order to post a cast `signer_uuid` must be approved)
   *
   *
   * @summary Posts a cast
   * @throws FetchError<400, types.PostCastResponse400> Bad Request
   * @throws FetchError<403, types.PostCastResponse403> Forbidden
   * @throws FetchError<404, types.PostCastResponse404> Resource not found
   * @throws FetchError<500, types.PostCastResponse500> Server Error
   */
  postCast(body: types.PostCastBodyParam, metadata: types.PostCastMetadataParam): Promise<FetchResponse<200, types.PostCastResponse200>> {
    return this.core.fetch('/farcaster/cast', 'post', body, metadata);
  }

  /**
   * Delete an existing cast. \
   * (In order to delete a cast `signer_uuid` must be approved)
   *
   *
   * @summary Delete a cast
   * @throws FetchError<400, types.DeleteCastResponse400> Bad Request
   * @throws FetchError<403, types.DeleteCastResponse403> Forbidden
   * @throws FetchError<404, types.DeleteCastResponse404> Resource not found
   * @throws FetchError<500, types.DeleteCastResponse500> Server Error
   */
  deleteCast(body: types.DeleteCastBodyParam, metadata: types.DeleteCastMetadataParam): Promise<FetchResponse<200, types.DeleteCastResponse200>> {
    return this.core.fetch('/farcaster/cast', 'delete', body, metadata);
  }

  /**
   * Retrieve multiple casts using their respective hashes.
   *
   * @summary Gets information about an array of casts
   * @throws FetchError<400, types.CastsResponse400> Bad Request
   */
  casts(metadata: types.CastsMetadataParam): Promise<FetchResponse<200, types.CastsResponse200>> {
    return this.core.fetch('/farcaster/casts', 'get', metadata);
  }

  /**
   * Gets all casts related to a conversation surrounding a cast by passing in a cast hash or
   * Warpcast URL. Includes all the ancestors of a cast up to the root parent in a
   * chronological order. Includes all direct_replies to the cast up to the reply_depth
   * specified in the query parameter.
   *
   * @summary Retrieve the conversation for a given cast
   * @throws FetchError<400, types.CastConversationResponse400> Bad Request
   */
  castConversation(metadata: types.CastConversationMetadataParam): Promise<FetchResponse<200, types.CastConversationResponse200>> {
    return this.core.fetch('/farcaster/cast/conversation', 'get', metadata);
  }

  /**
   * Retrieve casts based on filters
   *
   * @throws FetchError<400, types.FeedResponse400> Bad Request
   */
  feed(metadata: types.FeedMetadataParam): Promise<FetchResponse<200, types.FeedResponse200>> {
    return this.core.fetch('/farcaster/feed', 'get', metadata);
  }

  /**
   * Retrieve feed based on who a user is following
   *
   * @throws FetchError<400, types.FeedFollowingResponse400> Bad Request
   */
  feedFollowing(metadata: types.FeedFollowingMetadataParam): Promise<FetchResponse<200, types.FeedFollowingResponse200>> {
    return this.core.fetch('/farcaster/feed/following', 'get', metadata);
  }

  /**
   * Retrieve feed based on channel ids
   *
   * @throws FetchError<400, types.FeedChannelsResponse400> Bad Request
   */
  feedChannels(metadata: types.FeedChannelsMetadataParam): Promise<FetchResponse<200, types.FeedChannelsResponse200>> {
    return this.core.fetch('/farcaster/feed/channels', 'get', metadata);
  }

  /**
   * Retrieve feed of casts with Frames, reverse chronological order
   *
   * @throws FetchError<400, types.FeedFramesResponse400> Bad Request
   */
  feedFrames(metadata: types.FeedFramesMetadataParam): Promise<FetchResponse<200, types.FeedFramesResponse200>> {
    return this.core.fetch('/farcaster/feed/frames', 'get', metadata);
  }

  /**
   * Retrieve trending casts
   *
   * @throws FetchError<400, types.FeedTrendingResponse400> Bad Request
   */
  feedTrending(metadata: types.FeedTrendingMetadataParam): Promise<FetchResponse<200, types.FeedTrendingResponse200>> {
    return this.core.fetch('/farcaster/feed/trending', 'get', metadata);
  }

  /**
   * Retrieve 10 most popular casts for a given user FID; popularity based on replies, likes
   * and recasts; sorted by most popular first
   *
   * @summary Retrieve 10 most popular casts for a user
   * @throws FetchError<400, types.FeedUserPopularResponse400> Bad Request
   */
  feedUserPopular(metadata: types.FeedUserPopularMetadataParam): Promise<FetchResponse<200, types.FeedUserPopularResponse200>> {
    return this.core.fetch('/farcaster/feed/user/{fid}/popular', 'get', metadata);
  }

  /**
   * Retrieve recent replies and recasts for a given user FID; sorted by most recent first
   *
   * @summary Retrieve recent replies and recasts for a user
   * @throws FetchError<400, types.FeedUserRepliesRecastsResponse400> Bad Request
   */
  feedUserRepliesRecasts(metadata: types.FeedUserRepliesRecastsMetadataParam): Promise<FetchResponse<200, types.FeedUserRepliesRecastsResponse200>> {
    return this.core.fetch('/farcaster/feed/user/{fid}/replies_and_recasts', 'get', metadata);
  }

  /**
   * Retrieve a frame by UUID, if it was made by the developer (identified by API key)
   *
   * @summary Retrieve a frame by UUID
   * @throws FetchError<404, types.LookupNeynarFrameResponse404> Resource not found
   */
  lookupNeynarFrame(metadata: types.LookupNeynarFrameMetadataParam): Promise<FetchResponse<200, types.LookupNeynarFrameResponse200>> {
    return this.core.fetch('/farcaster/frame', 'get', metadata);
  }

  /**
   * Create a new frame with a list of pages.
   *
   * @summary Create a new frame
   * @throws FetchError<400, types.PublishNeynarFrameResponse400> Bad Request
   */
  publishNeynarFrame(body: types.PublishNeynarFrameBodyParam, metadata: types.PublishNeynarFrameMetadataParam): Promise<FetchResponse<200, types.PublishNeynarFrameResponse200>> {
    return this.core.fetch('/farcaster/frame', 'post', body, metadata);
  }

  /**
   * Update an existing frame with a list of pages, if it was made by the developer
   * (identified by API key)
   *
   * @summary Update an existing frame
   * @throws FetchError<400, types.UpdateNeynarFrameResponse400> Bad Request
   * @throws FetchError<404, types.UpdateNeynarFrameResponse404> Resource not found
   */
  updateNeynarFrame(body: types.UpdateNeynarFrameBodyParam, metadata: types.UpdateNeynarFrameMetadataParam): Promise<FetchResponse<200, types.UpdateNeynarFrameResponse200>> {
    return this.core.fetch('/farcaster/frame', 'put', body, metadata);
  }

  /**
   * Delete an existing frame, if it was made by the developer (identified by API key)
   *
   * @summary Delete a frame
   * @throws FetchError<404, types.DeleteNeynarFrameResponse404> Resource not found
   */
  deleteNeynarFrame(body: types.DeleteNeynarFrameBodyParam, metadata: types.DeleteNeynarFrameMetadataParam): Promise<FetchResponse<200, types.DeleteNeynarFrameResponse200>> {
    return this.core.fetch('/farcaster/frame', 'delete', body, metadata);
  }

  /**
   * Retrieve a list of frames made by the developer (identified by API key)
   *
   * @summary Retrieve a list of frames
   * @throws FetchError<404, types.FetchNeynarFramesResponse404> Resource not found
   */
  fetchNeynarFrames(metadata: types.FetchNeynarFramesMetadataParam): Promise<FetchResponse<200, types.FetchNeynarFramesResponse200>> {
    return this.core.fetch('/farcaster/frame/list', 'get', metadata);
  }

  /**
   * Post a reaction (like or recast) to a given cast \
   * (In order to post a reaction `signer_uuid` must be approved)
   *
   *
   * @summary Posts a reaction
   * @throws FetchError<400, types.PostReactionResponse400> Bad Request
   * @throws FetchError<403, types.PostReactionResponse403> Forbidden
   * @throws FetchError<404, types.PostReactionResponse404> Resource not found
   * @throws FetchError<500, types.PostReactionResponse500> Server Error
   */
  postReaction(body: types.PostReactionBodyParam, metadata: types.PostReactionMetadataParam): Promise<FetchResponse<200, types.PostReactionResponse200>> {
    return this.core.fetch('/farcaster/reaction', 'post', body, metadata);
  }

  /**
   * Delete a reaction (like or recast) to a given cast \
   * (In order to delete a reaction `signer_uuid` must be approved)
   *
   *
   * @summary Delete a reaction
   * @throws FetchError<400, types.DeleteReactionResponse400> Bad Request
   * @throws FetchError<403, types.DeleteReactionResponse403> Forbidden
   * @throws FetchError<404, types.DeleteReactionResponse404> Resource not found
   * @throws FetchError<500, types.DeleteReactionResponse500> Server Error
   */
  deleteReaction(body: types.DeleteReactionBodyParam, metadata: types.DeleteReactionMetadataParam): Promise<FetchResponse<200, types.DeleteReactionResponse200>> {
    return this.core.fetch('/farcaster/reaction', 'delete', body, metadata);
  }

  /**
   * Adds verification for an eth address for the user \
   * (In order to add verification `signer_uuid` must be approved)
   *
   *
   * @summary Adds verification for an eth address for the user
   */
  postFarcasterUserVerification(body: types.PostFarcasterUserVerificationBodyParam, metadata: types.PostFarcasterUserVerificationMetadataParam): Promise<FetchResponse<200, types.PostFarcasterUserVerificationResponse200>> {
    return this.core.fetch('/farcaster/user/verification', 'post', body, metadata);
  }

  /**
   * Removes verification for an eth address for the user \
   * (In order to delete verification `signer_uuid` must be approved)
   *
   *
   * @summary Removes verification for an eth address for the user
   */
  deleteFarcasterUserVerification(body: types.DeleteFarcasterUserVerificationBodyParam, metadata: types.DeleteFarcasterUserVerificationMetadataParam): Promise<FetchResponse<200, types.DeleteFarcasterUserVerificationResponse200>> {
    return this.core.fetch('/farcaster/user/verification', 'delete', body, metadata);
  }

  /**
   * Follow a user \
   * (In order to follow a user `signer_uuid` must be approved)
   *
   *
   * @summary Follow a user
   * @throws FetchError<400, types.FollowUserResponse400> Bad Request
   * @throws FetchError<403, types.FollowUserResponse403> Forbidden
   * @throws FetchError<404, types.FollowUserResponse404> Resource not found
   * @throws FetchError<500, types.FollowUserResponse500> Server Error
   */
  followUser(body: types.FollowUserBodyParam, metadata: types.FollowUserMetadataParam): Promise<FetchResponse<200, types.FollowUserResponse200>> {
    return this.core.fetch('/farcaster/user/follow', 'post', body, metadata);
  }

  /**
   * Unfollow a user \
   * (In order to unfollow a user `signer_uuid` must be approved)
   *
   *
   * @summary Unfollow a user
   * @throws FetchError<400, types.UnfollowUserResponse400> Bad Request
   * @throws FetchError<403, types.UnfollowUserResponse403> Forbidden
   * @throws FetchError<404, types.UnfollowUserResponse404> Resource not found
   * @throws FetchError<500, types.UnfollowUserResponse500> Server Error
   */
  unfollowUser(body: types.UnfollowUserBodyParam, metadata: types.UnfollowUserMetadataParam): Promise<FetchResponse<200, types.UnfollowUserResponse200>> {
    return this.core.fetch('/farcaster/user/follow', 'delete', body, metadata);
  }

  /**
   * Lookup a user by custody-address
   *
   * @summary Lookup a user by custody-address
   * @throws FetchError<400, types.LookupUserByCustodyAddressResponse400> Bad Request
   * @throws FetchError<404, types.LookupUserByCustodyAddressResponse404> Resource not found
   */
  lookupUserByCustodyAddress(metadata: types.LookupUserByCustodyAddressMetadataParam): Promise<FetchResponse<200, types.LookupUserByCustodyAddressResponse200>> {
    return this.core.fetch('/farcaster/user/custody-address', 'get', metadata);
  }

  /**
   * Fetch authorization url (Fetched authorized url useful for SIWN login operation)
   *
   * @summary Fetch authorization url
   * @throws FetchError<400, types.FetchAuthorizationUrlResponse400> Bad Request
   * @throws FetchError<401, types.FetchAuthorizationUrlResponse401> Unauthorized
   */
  fetchAuthorizationUrl(metadata: types.FetchAuthorizationUrlMetadataParam): Promise<FetchResponse<200, types.FetchAuthorizationUrlResponse200>> {
    return this.core.fetch('/farcaster/login/authorize', 'get', metadata);
  }

  /**
   * Post a frame action \
   * (In order to post a frame action, you need to have an approved `signer_uuid`)
   *
   * The POST request to the post_url has a timeout of 5 seconds.
   *
   *
   * @summary Posts a frame action
   * @throws FetchError<400, types.PostFrameActionResponse400> Bad Request
   * @throws FetchError<500, types.PostFrameActionResponse500> Server Error
   */
  postFrameAction(body: types.PostFrameActionBodyParam, metadata: types.PostFrameActionMetadataParam): Promise<FetchResponse<200, types.PostFrameActionResponse200>> {
    return this.core.fetch('/farcaster/frame/action', 'post', body, metadata);
  }

  /**
   * Validates a frame against by an interacting user against a Farcaster Hub \
   * (In order to validate a frame, message bytes from Frame Action must be provided in hex)
   *
   *
   * @summary Validates a frame action against Farcaster Hub
   * @throws FetchError<400, types.ValidateFrameResponse400> Bad Request
   * @throws FetchError<500, types.ValidateFrameResponse500> Server Error
   */
  validateFrame(body: types.ValidateFrameBodyParam, metadata: types.ValidateFrameMetadataParam): Promise<FetchResponse<200, types.ValidateFrameResponse200>> {
    return this.core.fetch('/farcaster/frame/validate', 'post', body, metadata);
  }

  /**
   * Retrieve a list of all the frames validated by a user
   *
   * @summary Retrieve a list of all the frames validated by a user
   * @throws FetchError<401, types.ValidateFrameListResponse401> Unauthorized
   * @throws FetchError<403, types.ValidateFrameListResponse403> Forbidden
   * @throws FetchError<500, types.ValidateFrameListResponse500> Server Error
   */
  validateFrameList(metadata: types.ValidateFrameListMetadataParam): Promise<FetchResponse<200, types.ValidateFrameListResponse200>> {
    return this.core.fetch('/farcaster/frame/validate/list', 'get', metadata);
  }

  /**
   * Retrieve analytics for total-interactors, interactors, nteractions-per-cast and
   * input-text.
   *
   * @summary Retrieve analytics for the frame
   * @throws FetchError<400, types.ValidateFrameAnalyticsResponse400> Bad Request
   * @throws FetchError<401, types.ValidateFrameAnalyticsResponse401> Unauthorized
   * @throws FetchError<403, types.ValidateFrameAnalyticsResponse403> Forbidden
   * @throws FetchError<500, types.ValidateFrameAnalyticsResponse500> Server Error
   */
  validateFrameAnalytics(metadata: types.ValidateFrameAnalyticsMetadataParam): Promise<FetchResponse<200, types.ValidateFrameAnalyticsResponse200>> {
    return this.core.fetch('/farcaster/frame/validate/analytics', 'get', metadata);
  }

  /**
   * Returns a list of notifications for a specific FID.
   *
   * @summary Retrieve notifications for a given user
   * @throws FetchError<400, types.NotificationsResponse400> Bad Request
   */
  notifications(metadata: types.NotificationsMetadataParam): Promise<FetchResponse<200, types.NotificationsResponse200>> {
    return this.core.fetch('/farcaster/notifications', 'get', metadata);
  }

  /**
   * Returns a list of notifications for a user in specific channels
   *
   * @summary Retrieve notifications for a user in given channels
   * @throws FetchError<400, types.NotificationsChannelResponse400> Bad Request
   */
  notificationsChannel(metadata: types.NotificationsChannelMetadataParam): Promise<FetchResponse<200, types.NotificationsChannelResponse200>> {
    return this.core.fetch('/farcaster/notifications/channel', 'get', metadata);
  }

  /**
   * Returns a list of notifications for a user in specific parent_urls
   *
   * @summary Retrieve notifications for a user in given parent_urls
   * @throws FetchError<400, types.NotificationsParentUrlResponse400> Bad Request
   */
  notificationsParentUrl(metadata: types.NotificationsParentUrlMetadataParam): Promise<FetchResponse<200, types.NotificationsParentUrlResponse200>> {
    return this.core.fetch('/farcaster/notifications/parent_url', 'get', metadata);
  }

  /**
   * Returns a list of all channels with their details
   *
   * @summary Retrieve all channels with their details
   */
  listAllChannels(metadata: types.ListAllChannelsMetadataParam): Promise<FetchResponse<200, types.ListAllChannelsResponse200>> {
    return this.core.fetch('/farcaster/channel/list', 'get', metadata);
  }

  /**
   * Returns a list of channels based on id or name
   *
   * @summary Search for channels based on id or name
   */
  searchChannels(metadata: types.SearchChannelsMetadataParam): Promise<FetchResponse<200, types.SearchChannelsResponse200>> {
    return this.core.fetch('/farcaster/channel/search', 'get', metadata);
  }

  /**
   * Returns details of a channel
   *
   * @summary Retrieve channel details by id
   * @throws FetchError<404, types.ChannelDetailsResponse404> Resource not found
   */
  channelDetails(metadata: types.ChannelDetailsMetadataParam): Promise<FetchResponse<200, types.ChannelDetailsResponse200>> {
    return this.core.fetch('/farcaster/channel', 'get', metadata);
  }

  /**
   * Returns a list of followers for a specific channel. Max limit is 1000. Use cursor for
   * pagination.
   *
   * @summary Retrieve followers for a given channel
   * @throws FetchError<400, types.ChannelFollowersResponse400> Bad Request
   */
  channelFollowers(metadata: types.ChannelFollowersMetadataParam): Promise<FetchResponse<200, types.ChannelFollowersResponse200>> {
    return this.core.fetch('/farcaster/channel/followers', 'get', metadata);
  }

  /**
   * Fetches all channels that a user has casted in, in reverse chronological order.
   *
   * @summary Get channels that a user is active in
   * @throws FetchError<400, types.ActiveChannelsResponse400> Bad Request
   * @throws FetchError<404, types.ActiveChannelsResponse404> Bad Request
   */
  activeChannels(metadata: types.ActiveChannelsMetadataParam): Promise<FetchResponse<200, types.ActiveChannelsResponse200>> {
    return this.core.fetch('/farcaster/channel/user', 'get', metadata);
  }

  /**
   * Returns a list of users who are active in a given channel, ordered by ascending FIDs
   *
   * @summary Retrieve users who are active in a channel
   * @throws FetchError<404, types.ChannelUsersResponse404> Resource not found
   */
  channelUsers(metadata: types.ChannelUsersMetadataParam): Promise<FetchResponse<200, types.ChannelUsersResponse200>> {
    return this.core.fetch('/farcaster/channel/users', 'get', metadata);
  }

  /**
   * Returns a list of trending channels based on activity
   *
   * @summary Retrieve trending channels based on activity
   * @throws FetchError<400, types.TrendingChannelsResponse400> Bad Request
   * @throws FetchError<500, types.TrendingChannelsResponse500> Server Error
   */
  trendingChannels(metadata: types.TrendingChannelsMetadataParam): Promise<FetchResponse<200, types.TrendingChannelsResponse200>> {
    return this.core.fetch('/farcaster/channel/trending', 'get', metadata);
  }

  /**
   * Returns a list of relevant followers for a specific FID.
   *
   * @summary Retrieve relevant followers for a given user
   * @throws FetchError<400, types.RelevantFollowersResponse400> Bad Request
   */
  relevantFollowers(metadata: types.RelevantFollowersMetadataParam): Promise<FetchResponse<200, types.RelevantFollowersResponse200>> {
    return this.core.fetch('/farcaster/followers/relevant', 'get', metadata);
  }

  /**
   * Fetches reactions for a given user
   *
   * @summary Fetches reactions for a given user
   * @throws FetchError<400, types.ReactionsUserResponse400> Bad Request
   */
  reactionsUser(metadata: types.ReactionsUserMetadataParam): Promise<FetchResponse<200, types.ReactionsUserResponse200>> {
    return this.core.fetch('/farcaster/reactions/user', 'get', metadata);
  }

  /**
   * Fetches reactions for a given cast
   *
   * @summary Fetches reactions for a given cast
   * @throws FetchError<400, types.ReactionsCastResponse400> Bad Request
   */
  reactionsCast(metadata: types.ReactionsCastMetadataParam): Promise<FetchResponse<200, types.ReactionsCastResponse200>> {
    return this.core.fetch('/farcaster/reactions/cast', 'get', metadata);
  }

  /**
   * Check if a given fname is available
   *
   * @summary Check if a given fname is available
   * @throws FetchError<400, types.FnameAvailabilityResponse400> Bad Request
   */
  fnameAvailability(metadata: types.FnameAvailabilityMetadataParam): Promise<FetchResponse<200, types.FnameAvailabilityResponse200>> {
    return this.core.fetch('/farcaster/fname/availability', 'get', metadata);
  }

  /**
   * Fetches storage allocations for a given user
   *
   * @summary Fetches storage allocations for a given user
   * @throws FetchError<400, types.StorageAllocationsResponse400> Bad Request
   */
  storageAllocations(metadata: types.StorageAllocationsMetadataParam): Promise<FetchResponse<200, types.StorageAllocationsResponse200>> {
    return this.core.fetch('/farcaster/storage/allocations', 'get', metadata);
  }

  /**
   * Fetches storage usage for a given user
   *
   * @summary Fetches storage usage for a given user
   * @throws FetchError<400, types.StorageUsageResponse400> Bad Request
   */
  storageUsage(metadata: types.StorageUsageMetadataParam): Promise<FetchResponse<200, types.StorageUsageResponse200>> {
    return this.core.fetch('/farcaster/storage/usage', 'get', metadata);
  }

  /**
   * Fetch a webhook
   *
   * @summary Fetch a webhook
   * @throws FetchError<404, types.LookupWebhookResponse404> Resource not found
   */
  lookupWebhook(metadata: types.LookupWebhookMetadataParam): Promise<FetchResponse<200, types.LookupWebhookResponse200>> {
    return this.core.fetch('/farcaster/webhook', 'get', metadata);
  }

  /**
   * Create a webhook
   *
   * @summary Create a webhook
   * @throws FetchError<400, types.PublishWebhookResponse400> Bad Request
   * @throws FetchError<404, types.PublishWebhookResponse404> Resource not found
   */
  publishWebhook(body: types.PublishWebhookBodyParam, metadata: types.PublishWebhookMetadataParam): Promise<FetchResponse<200, types.PublishWebhookResponse200>> {
    return this.core.fetch('/farcaster/webhook', 'post', body, metadata);
  }

  /**
   * Update webhook active status
   *
   * @summary Update webhook active status
   * @throws FetchError<400, types.UpdateWebhookActiveStatusResponse400> Bad Request
   */
  updateWebhookActiveStatus(body: types.UpdateWebhookActiveStatusBodyParam, metadata: types.UpdateWebhookActiveStatusMetadataParam): Promise<FetchResponse<200, types.UpdateWebhookActiveStatusResponse200>> {
    return this.core.fetch('/farcaster/webhook', 'patch', body, metadata);
  }

  /**
   * Update a webhook
   *
   * @summary Update a webhook
   * @throws FetchError<400, types.UpdateWebhookResponse400> Bad Request
   */
  updateWebhook(body: types.UpdateWebhookBodyParam, metadata: types.UpdateWebhookMetadataParam): Promise<FetchResponse<200, types.UpdateWebhookResponse200>> {
    return this.core.fetch('/farcaster/webhook', 'put', body, metadata);
  }

  /**
   * Delete a webhook
   *
   * @summary Delete a webhook
   * @throws FetchError<404, types.DeleteWebhookResponse404> Resource not found
   */
  deleteWebhook(body: types.DeleteWebhookBodyParam, metadata: types.DeleteWebhookMetadataParam): Promise<FetchResponse<200, types.DeleteWebhookResponse200>> {
    return this.core.fetch('/farcaster/webhook', 'delete', body, metadata);
  }

  /**
   * Fetch a list of webhooks associated to a user
   *
   * @summary Fetch a list of webhooks associated to a user
   */
  fetchWebhooks(metadata: types.FetchWebhooksMetadataParam): Promise<FetchResponse<200, types.FetchWebhooksResponse200>> {
    return this.core.fetch('/farcaster/webhook/list', 'get', metadata);
  }

  /**
   * Fetches all fids that a user has muted.
   *
   * @summary Get fids that a user has muted.
   * @throws FetchError<400, types.MuteListResponse400> Bad Request
   * @throws FetchError<404, types.MuteListResponse404> Resource not found
   * @throws FetchError<500, types.MuteListResponse500> Server Error
   */
  muteList(metadata: types.MuteListMetadataParam): Promise<FetchResponse<200, types.MuteListResponse200>> {
    return this.core.fetch('/farcaster/mute/list', 'get', metadata);
  }

  /**
   * Adds a mute for a given fid. This is a whitelisted API, reach out if you want access.
   *
   * @summary Adds a mute for a fid.
   * @throws FetchError<400, types.AddMuteResponse400> Bad Request
   * @throws FetchError<404, types.AddMuteResponse404> Resource not found
   * @throws FetchError<500, types.AddMuteResponse500> Server Error
   */
  addMute(body: types.AddMuteBodyParam, metadata: types.AddMuteMetadataParam): Promise<FetchResponse<200, types.AddMuteResponse200>> {
    return this.core.fetch('/farcaster/mute', 'post', body, metadata);
  }

  /**
   * Deletes a mute for a given fid. This is a whitelisted API, reach out if you want access.
   *
   * @summary Deletes a mute for a fid.
   * @throws FetchError<400, types.DeleteMuteResponse400> Bad Request
   * @throws FetchError<404, types.DeleteMuteResponse404> Resource not found
   * @throws FetchError<500, types.DeleteMuteResponse500> Server Error
   */
  deleteMute(body: types.DeleteMuteBodyParam, metadata: types.DeleteMuteMetadataParam): Promise<FetchResponse<200, types.DeleteMuteResponse200>> {
    return this.core.fetch('/farcaster/mute', 'delete', body, metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { ActiveChannelsMetadataParam, ActiveChannelsResponse200, ActiveChannelsResponse400, ActiveChannelsResponse404, ActiveUsersMetadataParam, ActiveUsersResponse200, ActiveUsersResponse400, AddMuteBodyParam, AddMuteMetadataParam, AddMuteResponse200, AddMuteResponse400, AddMuteResponse404, AddMuteResponse500, CastConversationMetadataParam, CastConversationResponse200, CastConversationResponse400, CastMetadataParam, CastResponse200, CastResponse400, CastsMetadataParam, CastsResponse200, CastsResponse400, ChannelDetailsMetadataParam, ChannelDetailsResponse200, ChannelDetailsResponse404, ChannelFollowersMetadataParam, ChannelFollowersResponse200, ChannelFollowersResponse400, ChannelUsersMetadataParam, ChannelUsersResponse200, ChannelUsersResponse404, CreateSignerMetadataParam, CreateSignerResponse200, CreateSignerResponse500, DeleteCastBodyParam, DeleteCastMetadataParam, DeleteCastResponse200, DeleteCastResponse400, DeleteCastResponse403, DeleteCastResponse404, DeleteCastResponse500, DeleteFarcasterUserVerificationBodyParam, DeleteFarcasterUserVerificationMetadataParam, DeleteFarcasterUserVerificationResponse200, DeleteMuteBodyParam, DeleteMuteMetadataParam, DeleteMuteResponse200, DeleteMuteResponse400, DeleteMuteResponse404, DeleteMuteResponse500, DeleteNeynarFrameBodyParam, DeleteNeynarFrameMetadataParam, DeleteNeynarFrameResponse200, DeleteNeynarFrameResponse404, DeleteReactionBodyParam, DeleteReactionMetadataParam, DeleteReactionResponse200, DeleteReactionResponse400, DeleteReactionResponse403, DeleteReactionResponse404, DeleteReactionResponse500, DeleteWebhookBodyParam, DeleteWebhookMetadataParam, DeleteWebhookResponse200, DeleteWebhookResponse404, DeveloperManagedSignerMetadataParam, DeveloperManagedSignerResponse200, DeveloperManagedSignerResponse400, FeedChannelsMetadataParam, FeedChannelsResponse200, FeedChannelsResponse400, FeedFollowingMetadataParam, FeedFollowingResponse200, FeedFollowingResponse400, FeedFramesMetadataParam, FeedFramesResponse200, FeedFramesResponse400, FeedMetadataParam, FeedResponse200, FeedResponse400, FeedTrendingMetadataParam, FeedTrendingResponse200, FeedTrendingResponse400, FeedUserPopularMetadataParam, FeedUserPopularResponse200, FeedUserPopularResponse400, FeedUserRepliesRecastsMetadataParam, FeedUserRepliesRecastsResponse200, FeedUserRepliesRecastsResponse400, FetchAuthorizationUrlMetadataParam, FetchAuthorizationUrlResponse200, FetchAuthorizationUrlResponse400, FetchAuthorizationUrlResponse401, FetchNeynarFramesMetadataParam, FetchNeynarFramesResponse200, FetchNeynarFramesResponse404, FetchWebhooksMetadataParam, FetchWebhooksResponse200, FnameAvailabilityMetadataParam, FnameAvailabilityResponse200, FnameAvailabilityResponse400, FollowUserBodyParam, FollowUserMetadataParam, FollowUserResponse200, FollowUserResponse400, FollowUserResponse403, FollowUserResponse404, FollowUserResponse500, GetFreshFidMetadataParam, GetFreshFidResponse200, GetFreshFidResponse500, ListAllChannelsMetadataParam, ListAllChannelsResponse200, LookupNeynarFrameMetadataParam, LookupNeynarFrameResponse200, LookupNeynarFrameResponse404, LookupUserByCustodyAddressMetadataParam, LookupUserByCustodyAddressResponse200, LookupUserByCustodyAddressResponse400, LookupUserByCustodyAddressResponse404, LookupWebhookMetadataParam, LookupWebhookResponse200, LookupWebhookResponse404, MuteListMetadataParam, MuteListResponse200, MuteListResponse400, MuteListResponse404, MuteListResponse500, NotificationsChannelMetadataParam, NotificationsChannelResponse200, NotificationsChannelResponse400, NotificationsMetadataParam, NotificationsParentUrlMetadataParam, NotificationsParentUrlResponse200, NotificationsParentUrlResponse400, NotificationsResponse200, NotificationsResponse400, PostCastBodyParam, PostCastMetadataParam, PostCastResponse200, PostCastResponse400, PostCastResponse403, PostCastResponse404, PostCastResponse500, PostFarcasterUserVerificationBodyParam, PostFarcasterUserVerificationMetadataParam, PostFarcasterUserVerificationResponse200, PostFrameActionBodyParam, PostFrameActionMetadataParam, PostFrameActionResponse200, PostFrameActionResponse400, PostFrameActionResponse500, PostReactionBodyParam, PostReactionMetadataParam, PostReactionResponse200, PostReactionResponse400, PostReactionResponse403, PostReactionResponse404, PostReactionResponse500, PowerUsersMetadataParam, PowerUsersResponse200, PowerUsersResponse400, PublishMessageBodyParam, PublishMessageMetadataParam, PublishMessageResponse200, PublishMessageResponse400, PublishMessageResponse500, PublishNeynarFrameBodyParam, PublishNeynarFrameMetadataParam, PublishNeynarFrameResponse200, PublishNeynarFrameResponse400, PublishWebhookBodyParam, PublishWebhookMetadataParam, PublishWebhookResponse200, PublishWebhookResponse400, PublishWebhookResponse404, ReactionsCastMetadataParam, ReactionsCastResponse200, ReactionsCastResponse400, ReactionsUserMetadataParam, ReactionsUserResponse200, ReactionsUserResponse400, RegisterSignedKeyBodyParam, RegisterSignedKeyForDeveloperManagedSignerBodyParam, RegisterSignedKeyForDeveloperManagedSignerMetadataParam, RegisterSignedKeyForDeveloperManagedSignerResponse200, RegisterSignedKeyForDeveloperManagedSignerResponse400, RegisterSignedKeyForDeveloperManagedSignerResponse500, RegisterSignedKeyMetadataParam, RegisterSignedKeyResponse200, RegisterSignedKeyResponse400, RegisterSignedKeyResponse403, RegisterSignedKeyResponse404, RegisterSignedKeyResponse500, RegisterUserBodyParam, RegisterUserMetadataParam, RegisterUserResponse200, RegisterUserResponse400, RegisterUserResponse401, RegisterUserResponse404, RegisterUserResponse409, RegisterUserResponse500, RelevantFollowersMetadataParam, RelevantFollowersResponse200, RelevantFollowersResponse400, SearchChannelsMetadataParam, SearchChannelsResponse200, SignerMetadataParam, SignerResponse200, SignerResponse400, SignerResponse403, SignerResponse404, SignerResponse500, StorageAllocationsMetadataParam, StorageAllocationsResponse200, StorageAllocationsResponse400, StorageUsageMetadataParam, StorageUsageResponse200, StorageUsageResponse400, TrendingChannelsMetadataParam, TrendingChannelsResponse200, TrendingChannelsResponse400, TrendingChannelsResponse500, UnfollowUserBodyParam, UnfollowUserMetadataParam, UnfollowUserResponse200, UnfollowUserResponse400, UnfollowUserResponse403, UnfollowUserResponse404, UnfollowUserResponse500, UpdateNeynarFrameBodyParam, UpdateNeynarFrameMetadataParam, UpdateNeynarFrameResponse200, UpdateNeynarFrameResponse400, UpdateNeynarFrameResponse404, UpdateUserBodyParam, UpdateUserMetadataParam, UpdateUserResponse200, UpdateUserResponse400, UpdateUserResponse403, UpdateUserResponse404, UpdateUserResponse500, UpdateWebhookActiveStatusBodyParam, UpdateWebhookActiveStatusMetadataParam, UpdateWebhookActiveStatusResponse200, UpdateWebhookActiveStatusResponse400, UpdateWebhookBodyParam, UpdateWebhookMetadataParam, UpdateWebhookResponse200, UpdateWebhookResponse400, UserBulkByAddressMetadataParam, UserBulkByAddressResponse200, UserBulkByAddressResponse400, UserBulkByAddressResponse404, UserBulkMetadataParam, UserBulkResponse200, UserBulkResponse400, UserChannelsMetadataParam, UserChannelsResponse200, UserSearchMetadataParam, UserSearchResponse200, UserSearchResponse400, ValidateFrameAnalyticsMetadataParam, ValidateFrameAnalyticsResponse200, ValidateFrameAnalyticsResponse400, ValidateFrameAnalyticsResponse401, ValidateFrameAnalyticsResponse403, ValidateFrameAnalyticsResponse500, ValidateFrameBodyParam, ValidateFrameListMetadataParam, ValidateFrameListResponse200, ValidateFrameListResponse401, ValidateFrameListResponse403, ValidateFrameListResponse500, ValidateFrameMetadataParam, ValidateFrameResponse200, ValidateFrameResponse400, ValidateFrameResponse500 } from './types';
