import { Router } from "express";
import {
  GetAllAffiliateTelegramLinksController,
  GetAffiliateTelegramLinkByIdController,
  UpdateAffiliateTelegramLinkController,
  DeleteAffiliateTelegramLinkController,
  InitiateAffiliateTelegramLinkController,
} from "../../controllers/Affiliate/AffiliateTelegramLinks.Controller";
import { authMiddleware } from "../../middlewares/Affiliate/Affiliate.Middleware";

const AffiliateTelegramLinkRoutes = Router();
AffiliateTelegramLinkRoutes.post(
  "/",
  authMiddleware,
  InitiateAffiliateTelegramLinkController
  /*
    #swagger.tags = ['Affiliate - Telegram Links']
    #swagger.description = `
        <p>Create a new Affiliate Telegram link (requires authentication). Acceptable user types are: AffiliateUser, Staff, or User.</p>
        
        <p><strong>Frontend to Backend Request:</strong> The frontend request (linkTelegramAccount function) notifies the server of the user's intent to link their Telegram account. It includes the userId, userType, and authentication tokens needed for backend verification.</p>

        <p><strong>Backend Response & User Action:</strong> After receiving the request, the backend responds with a deep link to the Telegram bot (e.g., https://t.me/olive_cherry_bot). The user must click this link to initiate the linking process in Telegram.</p>

        <p><strong>Telegram Bot Interaction:</strong></p>
        <ul>
            <li>When the user clicks the bot link, Telegram opens, and the user can send one of the following commands to link or unlink their account:</li>
            <ul>
                <li><code>/start</code> - Start the bot interaction.</li>
                <li><code>link my account</code> / <code>link account</code> / <code>link</code> - Link the user’s account.</li>
                <li><code>/unlink</code> / <code>no</code> / <code>not now</code> / <code>cancel</code> - Unlink the user’s account.</li>
            </ul>
            <li>The backend listens for these commands from the Telegram webhook, processes the action, and completes or cancels the link based on the user’s input.</li>
        </ul>

        <p>After the Telegram interaction, the frontend can make a GET request to <code>/affiliate/telegram/</code> with the <strong>token</strong> to verify the link status and update the UI accordingly.</p>

        <p><strong>Acceptable user types:</strong></p>
        <ul>
            <li><strong>AffiliateUser</strong> — Represents an affiliate user.</li>
            <li><strong>Staff</strong> — Represents an internal staff member.</li>
            <li><strong>User</strong> — Represents a regular user in the system.</li>
        </ul>
    `
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: "Payload for creating a new Affiliate Telegram link, including the user type. Valid user types are: AffiliateUser, Staff, or User.",
      schema: { 
        $ref: '#/definitions/CreateAffiliateTelegramLinkPayload' 
      }
    }
    #swagger.responses[201] = {
      description: "Created",
      schema: { $ref: '#/definitions/CreateAffiliateTelegramLinkResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
  */
);

AffiliateTelegramLinkRoutes.get(
  "/",
  authMiddleware,
  GetAllAffiliateTelegramLinksController
  /*
    #swagger.tags = ['Affiliate - Telegram Links']
    #swagger.description = "Retrieve all Affiliate Telegram links for a user (requires authentication). Acceptable user types are: 'AffiliateUser', 'Staff', or 'User'."
    #swagger.parameters['userType'] = {
      in: 'query',
      required: false,
      type: 'string',
      description: 'Filter by user type (AffiliateUser, Staff, or User)'
    }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetAllAffiliateTelegramLinksResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
  */
);

AffiliateTelegramLinkRoutes.get(
  "/:userType",
  authMiddleware,
  GetAffiliateTelegramLinkByIdController
  /*
    #swagger.tags = ['Affiliate - Telegram Links']
    #swagger.description = "Retrieve an Affiliate Telegram link by user ID and user type (requires authentication). Acceptable user types are: 'AffiliateUser', 'Staff', or 'User'."
    #swagger.parameters['userType'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'User type to retrieve link for (AffiliateUser, Staff, or User)'
    }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetAffiliateTelegramLinkByIdResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
    #swagger.responses[404] = {
      description: "Not Found",
      schema: { $ref: '#/definitions/NotFound' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
  */
);

AffiliateTelegramLinkRoutes.put(
  "/:userType",
  authMiddleware,
  UpdateAffiliateTelegramLinkController
  /*
    #swagger.tags = ['Affiliate - Telegram Links']
    #swagger.description = "Update an existing Affiliate Telegram link (requires authentication). Acceptable user types are: 'AffiliateUser', 'Staff', or 'User'."
    #swagger.parameters['userType'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'User type to update link for (AffiliateUser, Staff, or User)'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: "Payload for updating the Affiliate Telegram link.",
      schema: { $ref: '#/definitions/UpdateAffiliateTelegramLinkPayload' }
    }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/UpdateAffiliateTelegramLinkResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
    #swagger.responses[404] = {
      description: "Not Found",
      schema: { $ref: '#/definitions/NotFound' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
  */
);

AffiliateTelegramLinkRoutes.delete(
  "/:userType",
  authMiddleware,
  DeleteAffiliateTelegramLinkController
  /*
    #swagger.tags = ['Affiliate - Telegram Links']
    #swagger.description = "Delete an Affiliate Telegram link by user ID and user type (requires authentication). Acceptable user types are: 'AffiliateUser', 'Staff', or 'User'."
    #swagger.parameters['userType'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'User type to delete link for (AffiliateUser, Staff, or User)'
    }
    #swagger.responses[204] = {
      description: "No Content"
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
    #swagger.responses[404] = {
      description: "Not Found",
      schema: { $ref: '#/definitions/NotFound' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
  */
);

export default AffiliateTelegramLinkRoutes;
